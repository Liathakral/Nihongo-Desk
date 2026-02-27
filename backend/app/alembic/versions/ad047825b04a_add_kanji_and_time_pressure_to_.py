"""add kanji and time_pressure to MistakeType"""

from alembic import op

# revision identifiers
revision = "ad047825b04a"
down_revision = None  # replace if you have previous revision
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Add new enum values safely
    op.execute(
        "ALTER TYPE mistaketype ADD VALUE IF NOT EXISTS 'kanji';"
    )
    op.execute(
        "ALTER TYPE mistaketype ADD VALUE IF NOT EXISTS 'time_pressure';"
    )


def downgrade() -> None:
    # Enum value removal in Postgres is complex and unsafe.
    # Leaving empty intentionally.
    pass