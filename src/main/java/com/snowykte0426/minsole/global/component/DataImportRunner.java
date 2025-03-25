package com.snowykte0426.minsole.global.component;

import com.snowykte0426.minsole.domain.data.service.XlsxDataImporter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataImportRunner implements CommandLineRunner {

    private final XlsxDataImporter importer;

    @Autowired
    public DataImportRunner(XlsxDataImporter importer) {
        this.importer = importer;
    }

    @Override
    public void run(String... args) throws Exception {
        importer.importData("output.xlsx");
    }
}