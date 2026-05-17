import base64
import json
import uuid

from Crypto.PublicKey import RSA
from fastapi import status, HTTPException
from py_eureka_client.eureka_client import do_service_async
from sqlmodel.ext.asyncio.session import AsyncSession
from Crypto.Cipher import PKCS1_OAEP

from event.publisher import EventPublisher
from src.minigame.presentation.schema.event import GameType
from src.minigame.domain.model.minigame import MinigameBetStatus
from src.minigame.service.validation import BetValidationService
from src.minigame.service.bet import MinigameBetService
from src.yavarwee.domain.model.yavarwee_result import YavarweeResult
from src.yavarwee.domain.repository.yavarwee import YavarweeResultRepository
from src.minigame.domain.repository.minigame import MinigameRepository
from src.ticket.domain.model.ticket import Ticket
from src.ticket.domain.repository.ticket import TicketRepository
from src.yavarwee.presentation.schema.yavarwee import YavarweeBetReq, YavarweeBetRes, YavarweeBetConfirmDetail
from src.yavarwee.presentation.schema.yavarwee import YavarweeBetConfirmReq
from config import YAVARWEE_PRIVATE_KEY

YAVARWEE_ROUND_VALUE = [1.1, 1.3, 1.5, 2, 5]


class YavarweeMinigameBetServiceImpl(MinigameBetService):
    def __init__(self, session: AsyncSession):
        self.session = session
        self.minigame_repository = MinigameRepository(session)
        self.yavarwee_repository = YavarweeResultRepository(session)
        self.ticket_repository = TicketRepository(session)

    async def bet(self, stage_id, user_id, data: YavarweeBetReq):
        async with self.session.begin():
            bet_amount = data.amount

            # stage_id로 미니게임 조회
            minigame = await self.minigame_repository.find_by_stage_id(stage_id)
            if minigame is None or not minigame.is_active_yavarwee:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Minigame not found or Not Available')

            await BetValidationService.validate_minigame_status(minigame)

            # Student id 조회
            user_response = await do_service_async('gogo-user', f'/user/student?userId={user_id}')
            if not user_response:
                raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail='gogo-stage no response')
            student_id = json.loads(user_response)['studentId']

            await BetValidationService.is_student_participate_in_stage(stage_id=stage_id, student_id=student_id)

            # 유저 포인트 정보 가져오기
            response = await do_service_async('gogo-stage', f'/stage/api/point/{stage_id}?studentId={student_id}')
            if not response:
                raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail='gogo-stage no response')
            before_point = json.loads(response)['point']

            # 최대 최소 베팅 포인트 검사
            if bet_amount < minigame.yavarwee_min_betting_point or bet_amount > minigame.yavarwee_max_betting_point:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='bet amount out of range')

            # 포인트 검사
            if bet_amount > before_point:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='bet amount too high')

            # 티켓 검사 및 감소 (메인 트랜잭션 내에서 FOR UPDATE로 원자적 처리)
            ticket = await self.ticket_repository.find_ticket_amount_by_stage_id_and_student_id(stage_id=stage_id, student_id=student_id)
            if ticket is None:
                await self.ticket_repository.save(
                    Ticket(
                        minigame_id=minigame.minigame_id,
                        student_id=student_id,
                        coin_toss_ticket_amount=minigame.coin_toss_default_ticket_amount,
                        yavarwee_ticket_amount=minigame.yavarwee_default_ticket_amount,
                        plinko_ticket_amount=minigame.plinko_default_ticket_amount,
                    )
                )
                await self.session.flush()
                ticket = await self.ticket_repository.find_ticket_amount_by_stage_id_and_student_id(stage_id=stage_id, student_id=student_id)
            if ticket.yavarwee_ticket_amount <= 0:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Not enough ticket')

            # 티켓 감소
            ticket.yavarwee_ticket_amount -= 1
            uuid_ = uuid.uuid4()

            await self.yavarwee_repository.save(
                YavarweeResult(
                    minigame_id=minigame.minigame_id,
                    student_id=int(student_id),
                    bet_point=bet_amount,
                    yavarwee_stage=0,
                    point=-bet_amount,
                    uuid=str(uuid_),
                    status=MinigameBetStatus.CONFIRMED,
                    bet_confirmed=False
                )
            )

            await EventPublisher.minigame_bet_completed(
                uuid_=str(uuid_),
                earned_point=0,
                losted_point=bet_amount,
                is_win=False,
                student_id=student_id,
                stage_id=stage_id,
                game_type=GameType.YAVARWEE.value
            )

            return YavarweeBetRes(
                uuid=str(uuid_)
            )

    async def confirm(self, stage_id, user_id, data: YavarweeBetConfirmReq):
        async with (self.session.begin()):
            try:
                raw_key = YAVARWEE_PRIVATE_KEY.replace('\\n', '\n')
                private_key = RSA.import_key(raw_key)
                cipher_decrypt = PKCS1_OAEP.new(private_key)
                decrypted = cipher_decrypt.decrypt(base64.b64decode(data.data))
                json_load_data = YavarweeBetConfirmDetail(**json.loads(decrypted))
            except Exception as e:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=f'bet data is invalid: {e}')

            minigame = await self.yavarwee_repository.find_by_uuid(json_load_data.uuid)
            if minigame is None:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='Invalid bet')

            # Student id 조회
            user_response = await do_service_async('gogo-user', f'/user/student?userId={user_id}')
            if not user_response:
                raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail='gogo-stage no response')
            student_id = json.loads(user_response)['studentId']

            # 소유권 검증: 베팅한 본인만 confirm 가능
            if int(minigame.student_id) != int(student_id):
                raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Not your bet')

            if minigame.bet_confirmed:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='bet already confirmed')

            bet_amount = minigame.bet_point

            if json_load_data.status:
                earned_point = int(bet_amount * YAVARWEE_ROUND_VALUE[json_load_data.round - 1])
                losted_point = bet_amount

                await EventPublisher.minigame_bet_completed(
                    uuid_=minigame.uuid,
                    earned_point=earned_point,
                    losted_point=0,
                    is_win=True,
                    student_id=student_id,
                    stage_id=stage_id,
                    game_type=GameType.YAVARWEE.value
                )
            else:
                earned_point = 0
                losted_point = bet_amount

            minigame.bet_confirmed = True
            minigame.point = earned_point - losted_point
            minigame.yavarwee_stage = json_load_data.round

            return YavarweeBetReq(
                amount=minigame.point
            )