"""change message column to json"""

from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "b4aeb2e06f22"
down_revision: Union[str, Sequence[str], None] = "d1aaadeb99e5"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.alter_column(
        "insights",
        "message",
        existing_type=sa.VARCHAR(),
        type_=sa.JSON(),
        postgresql_using="to_json(message)",
        existing_nullable=False
    )


def downgrade() -> None:
    op.alter_column(
        "insights",
        "message",
        existing_type=sa.JSON(),
        type_=sa.VARCHAR(),
        postgresql_using="message::text",
        existing_nullable=False
    )