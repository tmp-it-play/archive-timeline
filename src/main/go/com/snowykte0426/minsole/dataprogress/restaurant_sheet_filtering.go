package main

import (
	"fmt"
	"github.com/xuri/excelize/v2"
	"log"
	"os"
	"strings"
)

func main() {
	inputPath := "/Users/snowykte0426/Programming/BigData-Server/src/main/go/com/snowykte0426/minsole/dataprogress/result/all_restaurant_filtered_data.xlsx"
	outputPath := "result/filtered_output.xlsx"

	f, err := excelize.OpenFile(inputPath)
	if err != nil {
		log.Fatalf("파일 열기 실패: %v", err)
	}
	defer func() {
		if err := f.Close(); err != nil {
			log.Fatalf("파일 닫기 실패: %v", err)
		}
	}()

	sheetName := f.GetSheetName(0)
	if sheetName == "" {
		log.Fatal("시트를 찾을 수 없습니다.")
	}

	rows, err := f.GetRows(sheetName)
	if err != nil {
		log.Fatalf("행 읽기 실패: %v", err)
	}
	if len(rows) == 0 {
		log.Fatal("엑셀에 데이터가 없습니다.")
	}

	// 남길 컬럼 매핑
	keepColumns := map[string]string{
		"개방서비스아이디": "serviceId",
		"개방자치단체코드": "orgCode",
		"관리번호":     "manageCode",
		"사업장명":     "bizName",
		"소재지도로명주소": "roadAddr",
		"소재지지번주소":  "jibunAddr",
		"인허가일자":    "applyDate",
		"주된음식":     "mainFood",
		"데이터갱신일자":  "lastUpdateDate",
		"소재지전화":    "phoneNum",
	}

	// 헤더 찾기
	header := rows[0]
	var keepOrder []int    // 남길 컬럼 인덱스 순서
	var newHeader []string // 새로 쓸 헤더

	for idx, colName := range header {
		if newName, ok := keepColumns[colName]; ok {
			keepOrder = append(keepOrder, idx)
			newHeader = append(newHeader, newName)
		}
	}

	// 새 파일 만들기
	newFile := excelize.NewFile()
	newSheet := newFile.GetSheetName(newFile.GetActiveSheetIndex())

	// 새 헤더 작성
	for colIdx, fieldName := range newHeader {
		cell, _ := excelize.CoordinatesToCellName(colIdx+1, 1)
		newFile.SetCellValue(newSheet, cell, fieldName)
	}

	// 데이터 복사
	for rowIdx, row := range rows[1:] {
		for colIdx, originalIdx := range keepOrder {
			cellValue := ""
			if originalIdx < len(row) {
				cellValue = strings.TrimSpace(row[originalIdx])
			}
			cell, _ := excelize.CoordinatesToCellName(colIdx+1, rowIdx+2)
			newFile.SetCellValue(newSheet, cell, cellValue)
		}
	}

	// 디렉토리 생성
	if _, err := os.Stat("result"); os.IsNotExist(err) {
		if err := os.Mkdir("result", 0755); err != nil {
			log.Fatalf("result 디렉토리 생성 실패: %v", err)
		}
	}

	// 파일 저장
	if err := newFile.SaveAs(outputPath); err != nil {
		log.Fatalf("파일 저장 실패: %v", err)
	}

	fmt.Println("✅ 처리 완료! 저장된 경로:", outputPath)
}
