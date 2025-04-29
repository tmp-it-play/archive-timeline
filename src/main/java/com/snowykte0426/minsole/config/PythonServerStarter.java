package com.snowykte0426.minsole.config;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.DisposableBean;

import java.io.File;

@Component
public class PythonServerStarter implements ApplicationRunner, DisposableBean {

    private Process pythonProcess;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        // 프로젝트 루트에서의 상대경로 혹은 절대경로로 스크립트 위치 지정
        File script = new File("/Users/snowykte0426/Programming/BigData-Server/src/main/java/com/snowykte0426/minsole/domain/search/service/generate.py");

        ProcessBuilder pb = new ProcessBuilder(
                "/Users/snowykte0426/Programming/BigData-Server/.venv/bin/python3",
                script.getAbsolutePath()
        );
        pb.redirectOutput(ProcessBuilder.Redirect.INHERIT);
        pb.redirectError(ProcessBuilder.Redirect.INHERIT);
        pythonProcess = pb.start();

        System.out.println("✅ Python AI 서버가 시작되었습니다: " + script.getAbsolutePath());
    }

    @Override
    public void destroy() throws Exception {
        if (pythonProcess != null && pythonProcess.isAlive()) {
            pythonProcess.destroy();
            System.out.println("🛑 Python AI 서버를 종료했습니다.");
        }
    }
}