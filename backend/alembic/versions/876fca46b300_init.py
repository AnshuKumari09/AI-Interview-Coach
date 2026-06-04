"""init

Revision ID: 876fca46b300
Revises: f5acb1ae8d32
Create Date: 2026-05-31 12:04:20.339024

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '876fca46b300'
down_revision: Union[str, Sequence[str], None] = 'f5acb1ae8d32'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
