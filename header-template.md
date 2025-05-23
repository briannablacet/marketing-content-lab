// STANDARD WALKTHROUGH HEADER TEMPLATE
// Copy this pattern to ALL walkthrough step components

// 1. PRODUCT STEP HEADER (Fixed)
const ProductStepHeader = () => (
  <div className="space-y-8 w-full">
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900">Tell us about your business</h1>
      <p className="text-gray-600">We'll use this information to personalize your marketing strategy</p>
    </div>
    {/* Your content here */}
  </div>
);

// 2. VALUE PROP STEP HEADER (Fixed)
const ValuePropStepHeader = () => (
  <div className="space-y-8 w-full">
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900">Craft your value proposition</h1>
      <p className="text-gray-600">Create a compelling statement that explains why customers choose you</p>
    </div>
    {/* Your content here */}
  </div>
);

// 3. IDEAL CUSTOMER STEP HEADER (Fixed)
const IdealCustomerStepHeader = () => (
  <div className="space-y-8 w-full">
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900">Define your ideal customer</h1>
      <p className="text-gray-600">Identify who benefits most from your product or service</p>
    </div>
    {/* Your content here */}
  </div>
);

// 4. COMPETITIVE STEP HEADER (Fixed)
const CompetitiveStepHeader = () => (
  <div className="space-y-8 w-full">
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900">Analyze your competition</h1>
      <p className="text-gray-600">Understand your competitive landscape and find your unique position</p>
    </div>
    {/* Your content here */}
  </div>
);

// 5. MESSAGING STEP HEADER (Fixed)
const MessagingStepHeader = () => (
  <div className="space-y-8 w-full">
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900">Develop key messages</h1>
      <p className="text-gray-600">Create consistent messaging that resonates with your audience</p>
    </div>
    {/* Your content here */}
  </div>
);

// 6. BRAND VOICE STEP HEADER (Fixed)
const BrandVoiceStepHeader = () => (
  <div className="space-y-8 w-full">
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900">Define your brand voice</h1>
      <p className="text-gray-600">Establish how your brand communicates and connects with people</p>
    </div>
    {/* Your content here */}
  </div>
);

// 7. STYLE GUIDE STEP HEADER (Fixed)
const StyleGuideStepHeader = () => (
  <div className="space-y-8 w-full">
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900">Create your style guide</h1>
      <p className="text-gray-600">Set writing standards and guidelines for consistent content</p>
    </div>
    {/* Your content here */}
  </div>
);

// 8. REVIEW STEP HEADER (Fixed)
const ReviewStepHeader = () => (
  <div className="space-y-8 w-full">
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900">Review your strategy</h1>
      <p className="text-gray-600">Review and finalize your complete marketing strategy</p>
    </div>
    {/* Your content here */}
  </div>
);

// TEMPLATE FOR ANY NEW STEP:
const NewStepHeader = () => (
  <div className="space-y-8 w-full">
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900">[Your Step Title]</h1>
      <p className="text-gray-600">[Your step description]</p>
    </div>
    {/* Your content here */}
  </div>
);

// WHAT TO REMOVE FROM EACH STEP:
// ❌ Remove: Large icons next to headers
// ❌ Remove: text-3xl font-bold headers  
// ❌ Remove: Complex header containers with borders
// ❌ Remove: Headers outside the main content area
// ❌ Remove: Inconsistent spacing

// WHAT TO KEEP:
// ✅ Keep: text-2xl font-semibold for main header
// ✅ Keep: text-gray-600 for subheader
// ✅ Keep: space-y-4 between header and subheader
// ✅ Keep: space-y-8 between header section and content
// ✅ Keep: Simple, clean styling matching WelcomeStep