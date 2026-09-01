FROM python:3.11-slim

RUN pip install --no-cache-dir slither-analyzer solc-select

RUN solc-select install 0.4.17 && \
    solc-select use 0.4.17

WORKDIR /workspace

ENTRYPOINT ["slither"]