package com.aimarketing.integration;

import com.aimarketing.config.AiServiceProperties;
import com.aimarketing.exception.AiServiceException;
import java.time.Duration;
import java.util.concurrent.TimeoutException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientRequestException;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import reactor.core.Exceptions;
import reactor.util.retry.Retry;

@Slf4j
@Component
@RequiredArgsConstructor
public class AiContentClient {

    private static final String GENERATE_PATH = "/api/v1/generate";

    private final WebClient aiWebClient;
    private final AiServiceProperties properties;

    public AiContentResponse generateContent(AiContentRequest request) {
        try {
            return aiWebClient.post()
                    .uri(GENERATE_PATH)
                    .bodyValue(request)
                    .retrieve()
                    .onStatus(HttpStatusCode::isError, response ->
                            response.bodyToMono(String.class)
                                    .defaultIfEmpty("AI service returned an error.")
                                    .map(body -> new AiServiceException(
                                            "AI service error: " + response.statusCode() + " " + body
                                    )))
                    .bodyToMono(AiContentResponse.class)
                    .timeout(Duration.ofSeconds(properties.timeoutSeconds()))
                    .retryWhen(Retry.backoff(properties.maxRetries(), Duration.ofMillis(300))
                            .filter(this::isRetryable)
                            .onRetryExhaustedThrow((spec, signal) ->
                                    Exceptions.propagate(signal.failure())))
                    .block();
        } catch (WebClientResponseException ex) {
            log.warn("FastAPI AI service response failure: status={} body={}",
                    ex.getStatusCode(), ex.getResponseBodyAsString());
            throw new AiServiceException("AI service returned an unexpected response.", ex);
        } catch (WebClientRequestException ex) {
            log.warn("FastAPI AI service connection failure", ex);
            throw new AiServiceException("AI service is unreachable. Check that FastAPI is running.", ex);
        } catch (RuntimeException ex) {
            if (ex.getCause() instanceof TimeoutException || ex instanceof AiServiceException) {
                throw ex;
            }
            log.warn("FastAPI AI service call failed", ex);
            throw new AiServiceException("AI service request failed.", ex);
        }
    }

    private boolean isRetryable(Throwable throwable) {
        return throwable instanceof WebClientRequestException
                || throwable instanceof TimeoutException
                || throwable instanceof AiServiceException;
    }
}
