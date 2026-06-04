"""init users and resumes

Revision ID: 8f32346d2f80
Revises: 876fca46b300
Create Date: 2026-05-31 12:20:36.675588

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8f32346d2f80'
down_revision: Union[str, Sequence[str], None] = '876fca46b300'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
