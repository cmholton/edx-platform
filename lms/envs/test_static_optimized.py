"""
Settings used when generating static assets for use in tests.

For example, Bok Choy uses two different settings files:
1. test_static_optimized is used when invoking collectstatic
2. bok_choy is used when running CMS and LMS

Note: it isn't possible to have a single settings file, because Django doesn't
support both generating static assets to a directory and also serving static
from the same directory.
"""

# First import the devstack base settings
from .devstack import *  # pylint: disable=wildcard-import, unused-wildcard-import

######################### Static file overrides ####################################

# Redirect to the test_root folder within the repo
TEST_ROOT = REPO_ROOT / "test_root"  # pylint: disable=no-value-for-parameter
LOG_DIR = (TEST_ROOT / "log").abspath()

# Store the static files under test root so that they don't overwrite existing static assets
STATIC_ROOT = (TEST_ROOT / "staticfiles" / "lms").abspath()

# Disable uglify when tests are running (used by build.js).
# 1. Uglify is by far the slowest part of the build process
# 2. Having full source code makes debugging tests easier for developers
os.environ['REQUIRE_BUILD_PROFILE_OPTIMIZE'] = 'none'
