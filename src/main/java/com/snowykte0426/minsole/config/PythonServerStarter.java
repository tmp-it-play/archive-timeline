package com.snowykte0426.minsole.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.DisposableBean;

import java.io.File;

@Slf4j
@Component
public class PythonServerStarter implements ApplicationRunner, DisposableBean {

    private Process pythonProcess;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        File script = new File("/Users/snowykte0426/Programming/BigData-Server/src/main/java/com/snowykte0426/minsole/domain/search/service/generate.py");

        ProcessBuilder pb = new ProcessBuilder(
                "/Users/snowykte0426/Programming/BigData-Server/.venv/bin/python3",
                script.getAbsolutePath()
        );
        pb.redirectOutput(ProcessBuilder.Redirect.INHERIT);
        pb.redirectError(ProcessBuilder.Redirect.INHERIT);
        pythonProcess = pb.start();

        log.info("Python AI 서버가 시작되었습니다: {}", script.getAbsolutePath());
    }

    @Override
    public void destroy() throws Exception {
        if (pythonProcess != null && pythonProcess.isAlive()) {
            pythonProcess.destroy();
            log.info("Python AI 서버가 종료되었습니다.");
        }
    }
}