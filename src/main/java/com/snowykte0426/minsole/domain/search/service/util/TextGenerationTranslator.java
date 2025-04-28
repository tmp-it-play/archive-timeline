package com.snowykte0426.minsole.domain.search.service.util;

import ai.djl.translate.Batchifier;
import ai.djl.translate.Translator;
import ai.djl.translate.TranslatorContext;

public class TextGenerationTranslator implements Translator<String, String> {

    @Override
    public Batchifier getBatchifier() {
        return null;
    }

    @Override
    public String processOutput(TranslatorContext ctx, ai.djl.ndarray.NDList list) {
        // Process the output from the model
        return list.singletonOrThrow().toString();
    }

    @Override
    public ai.djl.ndarray.NDList processInput(TranslatorContext ctx, String input) {
        // Convert the input string to NDArray format
        return new ai.djl.ndarray.NDList(ctx.getNDManager().create(input));
    }
}