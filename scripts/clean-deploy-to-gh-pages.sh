#!/bin/bash

# Clean deployment to gh-pages branch
# Only deploys necessary build artifacts

set -e

echo "🚀 Starting clean deployment to gh-pages branch..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in project root directory"
    exit 1
fi

# Store current branch
CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Current branch: $CURRENT_BRANCH"

# Build the project
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed successfully"

# Verify build artifacts
echo "🔍 Verifying build artifacts..."
if [ ! -f "build/static/js/main.9c4e149d.js" ]; then
    echo "❌ New bundle not found in build artifacts"
    exit 1
fi

if [ ! -f "build/index.html" ]; then
    echo "❌ index.html not found in build artifacts"
    exit 1
fi

echo "✅ Build artifacts verified"

# Create or switch to gh-pages branch
echo "🌿 Creating gh-pages branch..."
if git show-ref --verify --quiet refs/heads/gh-pages; then
    git checkout gh-pages
    git rm -rf . || true
else
    git checkout --orphan gh-pages
    git rm -rf . || true
fi

# Copy only necessary build artifacts
echo "📁 Copying build artifacts..."
cp -r build/* .

# Create .nojekyll file to disable Jekyll processing
touch .nojekyll

# Copy CNAME file if it exists
if [ -f "CNAME" ]; then
    cp CNAME .
fi

# Add and commit changes
echo "📝 Committing changes..."
git add .
git commit -m "Deploy to gh-pages - $(date +%Y-%m-%d_%H-%M-%S)

🚀 Clean Deployment:
- Bundle: main.9c4e149d.js
- Content: All 6 books including Utah's Best Poetry & Prose
- Build: $(date)
- Method: Clean gh-pages deployment

📚 Books:
$(jq -r '.[].title' public/content/books-index.json | sed 's/^/- /')

✅ Ready for GitHub Pages deployment" || {
    echo "⚠️ No changes to commit"
}

# Push to gh-pages branch
echo "📤 Pushing to gh-pages branch..."
git push origin gh-pages --force

# Switch back to original branch
echo "🔙 Switching back to $CURRENT_BRANCH branch..."
git checkout "$CURRENT_BRANCH"

echo "✅ Deployment to gh-pages completed!"
echo "🌐 Site will be available at: https://edmondaporter.com"
echo "⏳ Please allow 1-2 minutes for GitHub Pages to update"

# Verify deployment
echo "🔍 Verifying deployment..."
sleep 30

if curl -f -s "https://edmondaporter.com/static/js/main.9c4e149d.js" > /dev/null; then
    echo "✅ New bundle accessible on live site"
else
    echo "❌ New bundle not accessible on live site"
    echo "⏳ Deployment may need more time to propagate"
fi

if curl -s "https://edmondaporter.com/" | grep -q "Utah.*Best.*Poetry"; then
    echo "✅ New content found on live site"
else
    echo "❌ New content not found on live site"
    echo "⏳ Content may need more time to propagate"
fi

echo "🎉 Deployment process completed!"
