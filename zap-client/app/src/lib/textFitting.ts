// Font ranges - hardcoded for reliability
const fontWidthRange = { min: 0.1, max: 100 };
const fontSizeRange = { min: 0.7, max: 1 };
const fallbackFontSize = 0.5; // Font size for two-line fallback

/**
 * Measures if text fits within container after forcing a reflow
 * @param {HTMLElement} textElement - The text element to measure
 * @param {number} containerWidth - The container width to fit within
 * @returns {boolean} - True if text fits, false if it overflows
 */
function doesTextFit(textElement: HTMLElement, containerWidth: number): boolean {
	// Force reflow and measure
	textElement.offsetHeight;
	const currentWidth = textElement.scrollWidth;
	
	return currentWidth <= containerWidth;
}

/**
 * Binary search optimization that finds the maximum value that still fits within container
 * 
 * This function implements a binary search algorithm to efficiently find the largest value
 * in a given range that allows text to fit within the container. Instead of testing every
 * possible value linearly (which could be 1000+ iterations), binary search reduces this
 * to ~10 iterations by repeatedly halving the search space.
 * 
 * Algorithm:
 * 1. Start with full range [min, max]
 * 2. Test the midpoint value
 * 3. If it fits: save as best candidate, search upper half for potentially better values
 * 4. If it doesn't fit: search lower half for smaller values that might fit
 * 5. Repeat until search space is exhausted
 * 
 * Performance: O(log n) vs O(n) for linear search
 * Example: Width range 0.1-100 with 0.1 steps = 1000 possible values
 * - Linear search: up to 1000 DOM measurements
 * - Binary search: ~10 DOM measurements (log2(1000) ≈ 10)
 * 
 * @param {HTMLElement} textElement - The text element to optimize (gets style applied)
 * @param {number} containerWidth - The container width constraint in pixels
 * @param {Object} range - Search parameters: { min: number, max: number, step: number }
 * @param {Function} applySetting - Callback to apply test value: (element, value) => void
 * @param {string} description - Human-readable description for console logging
 * @returns {number} - The optimal (maximum fitting) value found
 */
function findOptimalValue(
	textElement: HTMLElement, 
	containerWidth: number, 
	range: { min: number; max: number; step: number }, 
	applySetting: (element: HTMLElement, value: number) => void, 
	description: string
): number {
	console.log(`🎯 ${description}: Binary searching from ${range.min} to ${range.max}...`);
	
	// Binary search bounds - we'll narrow these down each iteration
	let low = range.min;    // Smallest possible value (known to fit)
	let high = range.max;   // Largest possible value (may or may not fit)
	let bestValue = range.min; // Best fitting value found so far (fallback)
	let iterations = 0;     // Performance tracking
	
	// Continue until search space is exhausted
	while (low <= high) {
		iterations++;
		
		// Find midpoint between current bounds
		const mid = low + (high - low) / 2;
		
		// Round to nearest step increment to maintain precision
		// (e.g., if step=0.1, ensure we test 5.3, not 5.29999...)
		const testValue = Math.round(mid / range.step) * range.step;
		
		// Apply the test value and measure if text fits
		applySetting(textElement, testValue);
		
		if (doesTextFit(textElement, containerWidth)) {
			// SUCCESS: Text fits at this value!
			// Save as our best candidate (in case we don't find anything better)
			bestValue = testValue;
			
			// Try to find an even larger value that still fits
			// Search the upper half: [testValue + step, high]
			low = testValue + range.step;
		} else {
			// FAILURE: Text overflows at this value
			// We need a smaller value, search the lower half: [low, testValue - step]
			high = testValue - range.step;
		}
	}
	
	// Log performance comparison against naive linear search
	console.log(`  └─ Found ${bestValue} in ${iterations} iterations (vs ${Math.ceil((range.max - range.min) / range.step)} linear)`);
	
	return bestValue;
}

/**
 * Finds optimal position to insert line break for two-line layout
 * Prefers spaces closer to the beginning if multiple options are equally good
 * @param {string} text - The text to split
 * @returns {string} - Text with <br /> inserted at optimal position
 */
function insertOptimalLineBreak(text: string): string {
	const spaces = [];
	// Find all space positions
	for (let i = 0; i < text.length; i++) {
		if (text[i] === ' ') {
			spaces.push(i);
		}
	}
	
	if (spaces.length === 0) {
		// No spaces found, can't break cleanly
		return text;
	}
	
	const textLength = text.length;
	const midpoint = textLength / 2;
	
	// Find the space closest to midpoint, preferring earlier positions
	let bestSpaceIndex = spaces[0];
	let bestScore = Math.abs(spaces[0] - midpoint) + (spaces[0] * 0.1); // Bias toward earlier positions
	
	for (let i = 1; i < spaces.length; i++) {
		const spacePos = spaces[i];
		const score = Math.abs(spacePos - midpoint) + (spacePos * 0.1); // Bias toward earlier positions
		
		if (score < bestScore) {
			bestScore = score;
			bestSpaceIndex = spacePos;
		}
	}
	
	// Insert <br /> at the chosen space position
	return text.substring(0, bestSpaceIndex) + '<br />' + text.substring(bestSpaceIndex + 1);
}

/**
 * Attempts Phase 3 two-line fallback when single-line optimization fails
 * @param {HTMLElement} textElement - The text element to optimize
 * @param {number} containerWidth - The container width constraint
 * @param {Object} fontWidthRange_withStep - Width range with step property
 * @returns {number} - The optimal width value for two-line layout
 */
function attemptTwoLineFallback(textElement: HTMLElement, containerWidth: number, fontWidthRange_withStep: { min: number; max: number; step: number }): number {
	// Store original text for line break insertion
	const originalText = textElement.textContent || textElement.innerText;
	
	// Set to fallback font size and insert line break
	(textElement as HTMLElement).style.fontSize = `${fallbackFontSize}em`;
	(textElement as HTMLElement).style.whiteSpace = 'pre'; // Preserve whitespace and line breaks, no automatic wrapping
	
	// Convert <br /> to actual line break character for pre mode
	const textWithLineBreak = insertOptimalLineBreak(originalText).replace('<br />', '\n');
	textElement.textContent = textWithLineBreak; // Use textContent with \n for pre mode
	
	// Optimize width for two-line layout
	const bestFitWidthTwoLine = findOptimalValue(
		textElement,
		containerWidth,
		fontWidthRange_withStep,
		(element, width) => (element as HTMLElement).style.fontVariationSettings = `'wdth' ${width}`,
		"Width optimization (two-line)"
	);
	
	// Apply final two-line settings
	(textElement as HTMLElement).style.fontVariationSettings = `'wdth' ${bestFitWidthTwoLine}`;
	
	return bestFitWidthTwoLine;
}

export function fitTextToContainer(textElement: HTMLElement, containerElement: HTMLElement): number {
	// Reset to single-line mode at the start (in case previous text used two-line mode)
	(textElement as HTMLElement).style.whiteSpace = 'nowrap';
	
	// Reset and start at the most compressed state possible
	(textElement as HTMLElement).style.width = '100%';
	(textElement as HTMLElement).style.fontVariationSettings = `'wdth' ${fontWidthRange.min}`;
	(textElement as HTMLElement).style.fontSize = `${fontSizeRange.min}em`;
	
	// Force reflow to get accurate measurements
	textElement.offsetHeight;
	
	const containerWidth = containerElement.offsetWidth;
	
	console.log(`🔍 SEARCH START - Container: ${containerWidth}px`);
	console.log(`🎯 Starting at most compressed: ${fontWidthRange.min}% width, ${fontSizeRange.min}em font size`);
	
	// Phase 1: Optimize font size (keeping width at minimum)
	const fontSizeRange_withStep = { ...fontSizeRange, step: 0.01 };
	const bestFitSize = findOptimalValue(
		textElement, 
		containerWidth, 
		fontSizeRange_withStep,
		(element, size) => (element as HTMLElement).style.fontSize = `${size}em`,
		"Phase 1: Font size optimization"
	);

	// Set the font size to the best fit we found
	console.log(`🎯 Phase 1 complete: Best font size is ${bestFitSize}em`);
	(textElement as HTMLElement).style.fontSize = `${bestFitSize}em`;
	
	// Phase 2: Optimize width (with optimal font size)
	const fontWidthRange_withStep = { ...fontWidthRange, step: 0.01 };
	const bestFitWidth = findOptimalValue(
		textElement,
		containerWidth,
		fontWidthRange_withStep,
		(element, width) => (element as HTMLElement).style.fontVariationSettings = `'wdth' ${width}`,
		"Phase 2: Width optimization"
	);

	// Set the font width to the best fit we found
	console.log(`🎯 Phase 2 complete: Best font width is ${bestFitWidth}%`);
	(textElement as HTMLElement).style.fontVariationSettings = `'wdth' ${bestFitWidth}`;
	
	// Check if single-line optimization succeeded
	textElement.offsetHeight;
	const singleLineWidth = textElement.scrollWidth;
	
	// If still doesn't fit, attempt two-line fallback
	if (singleLineWidth > containerWidth) {
		console.log(`⚠️ Text still doesn't fit at maximum compression - initiating Phase 3: Two-line fallback`);
		console.log(`🎯 Phase 3a: Set to ${fallbackFontSize}em font size and inserted line break`);
		
		const bestFitWidthTwoLine = attemptTwoLineFallback(textElement, containerWidth, fontWidthRange_withStep);
		
		console.log(`🎯 Phase 3b: Width optimization complete`);
		console.log(`✅ PHASE 3 COMPLETE - Two-line fallback: ${bestFitWidthTwoLine.toFixed(1)}% width with ${fallbackFontSize}em font size`);
		
		return bestFitWidthTwoLine;
	}

	console.log(`✅ SEARCH COMPLETE - Best fit: ${bestFitWidth.toFixed(1)}% width with ${bestFitSize.toFixed(2)}em font size`);
	
	return bestFitWidth;
}

export function updateArticleText(textElement: HTMLElement, containerElement: HTMLElement, newText: string): void {
	if (textElement && containerElement) {
		// Reset to plain text (removes any html tags)
		textElement.innerHTML = '';
		textElement.textContent = newText;
		
		// Small delay to ensure DOM is updated
		setTimeout(() => {
			fitTextToContainer(textElement, containerElement);
		}, 10);
	}
}
