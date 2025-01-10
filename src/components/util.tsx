// Function to render the formatted text in the preview (simple markdown logic)
export const renderPreview = (text: string) => {
    // eslint-disable-next-line
    const boldPattern = /\*([^\*]+)\*/g; // Find *text*
    const italicPattern = /_([^_]+)_/g; // Find _text_
    const strikePattern = /~([^~]+)~/g; // Find ~text~

    // Replace markdown with HTML tags
    let formattedText = text
        .replace(boldPattern, "<strong>$1</strong>") // Replace *text* with <strong>
        .replace(italicPattern, "<em>$1</em>") // Replace _text_ with <em>
        .replace(strikePattern, "<del>$1</del>"); // Replace ~text~ with <del>

    return { __html: formattedText }; // Return as HTML safe string
};

export const ACCESS_URL = 'https://5vjexmacua2rww6gz2xbkgq7u40bkdqm.lambda-url.ap-southeast-1.on.aws';

export const RUN_ENGINE_URL = 'https://t3bavo6jfpyryiceh7cpxuo2uu0xlwix.lambda-url.ap-southeast-1.on.aws'