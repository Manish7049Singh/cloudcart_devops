from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    database_url: str | None = None
    db_username: str | None = None
    db_password: str | None = None
    db_hostname: str | None = None
    db_port: int | None = None
    db_name: str | None = None

    secret_key: str = "local-development-only-change-before-deploying"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30

    @property
    def sqlalchemy_database_url(self) -> str:
        if self.database_url:
            if self.database_url.startswith("postgres://"):
                return self.database_url.replace("postgres://", "postgresql+psycopg2://", 1)
            return self.database_url

        if all((self.db_username, self.db_password, self.db_hostname, self.db_port, self.db_name)):
            from sqlalchemy import URL

            return URL.create(
                "postgresql+psycopg2",
                username=self.db_username,
                password=self.db_password,
                host=self.db_hostname,
                port=self.db_port,
                database=self.db_name,
            ).render_as_string(hide_password=False)

        return "sqlite:///./ecommerce.db"

settings = Settings()
