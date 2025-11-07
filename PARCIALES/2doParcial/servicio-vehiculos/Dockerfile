FROM rust:latest as builder
WORKDIR /app

RUN apt-get update && apt-get install -y protobuf-compiler pkg-config && rm -rf /var/lib/apt/lists/*


COPY Cargo.toml Cargo.lock ./
COPY proto ./proto
RUN mkdir -p src && echo "fn main() {}" > src/main.rs
RUN cargo build --release || true


COPY src ./src
COPY build.rs ./build.rs
RUN cargo build --release

FROM debian:bookworm-slim
WORKDIR /app
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app/target/release/vehicles-api /app/vehicles-api
ENV VEHICULOS_HTTP_PORT=3002
ENV VEHICULOS_GRPC_PORT=50051
EXPOSE 3002 50051
CMD ["/app/vehicles-api"]
