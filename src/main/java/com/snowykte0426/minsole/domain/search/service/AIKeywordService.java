package com.snowykte0426.minsole.domain.search.service;

import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonParser;
import com.google.gson.JsonSyntaxException;
import com.google.gson.reflect.TypeToken;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AIKeywordService {

    private static final Gson GSON = new Gson();

    public List<String> generateByPython(int limit) {
        ProcessBuilder pb = new ProcessBuilder(
                "/Users/snowykte0426/Programming/BigData-Server/.venv/bin/python3",
                "/Users/snowykte0426/Programming/BigData-Server/src/main/java/com/snowykte0426/minsole/domain/search/service/generate.py",
                "--prompt", "음식점 관련 검색 키워드(예시: 떡볶이,여름,밥)" + limit + "개",
                "--limit", String.valueOf(limit)
        );
        pb.redirectErrorStream(true);

        try {
            Process proc = pb.start();
            String jsonLine = null;

            // stdout+stderr 합쳐진 스트림에서
            // JSON이 시작되는 줄을 찾는다
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(proc.getInputStream()))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    line = line.trim();
                    if (line.startsWith("[") || line.startsWith("{")) {
                        jsonLine = line;
                        break;
                    }
                }
            }

            proc.waitFor();

            if (jsonLine == null || jsonLine.isEmpty()) {
                throw new RuntimeException("Python 스크립트가 JSON 출력을 찾지 못했습니다.");
            }

            // JSON이 배열인지, 에러 객체인지 확인
            JsonElement je = JsonParser.parseString(jsonLine);
            if (je.isJsonObject() && je.getAsJsonObject().has("error")) {
                String err = je.getAsJsonObject().get("error").getAsString();
                throw new RuntimeException("Python 에러: " + err);
            }

            // 정상 JSON 배열이라면 List<String> 으로 변환
            return GSON.fromJson(
                    je,
                    new TypeToken<List<String>>() {}.getType()
            );

        } catch (IOException | InterruptedException | JsonSyntaxException e) {
            throw new RuntimeException("Python 호출 중 오류 발생", e);
        }
    }
}