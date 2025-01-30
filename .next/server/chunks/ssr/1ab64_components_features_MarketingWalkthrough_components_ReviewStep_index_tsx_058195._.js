module.exports = {

"[project]/src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx [ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx
__turbopack_esm__({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_import__("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ContentContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/src/context/ContentContext.tsx [ssr] (ecmascript)");
;
;
const ReviewStep = ()=>{
    const { selectedContentTypes } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$ContentContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useContent"])();
    const completedSteps = [
        {
            title: "Target Persona",
            description: "You've defined your ideal customer profile and key audience segments",
            items: [
                "B2B Technology Decision Makers",
                "Security-Focused IT Leaders"
            ]
        },
        {
            title: "Competitive Analysis",
            description: "You've mapped out your market position and competitive advantages",
            items: [
                "Market Differentiators",
                "Competitor Strengths/Weaknesses"
            ]
        },
        {
            title: "Key Messages",
            description: "You've crafted your core value propositions",
            items: [
                "Primary Value Props",
                "Key Benefits"
            ]
        },
        {
            title: "Budget Allocation",
            description: "You've planned your marketing investment strategy",
            items: [
                "Resource Distribution",
                "ROI Targets"
            ]
        },
        {
            title: "Channel Strategy",
            description: "You've selected your marketing channels for maximum impact",
            items: [
                "Primary Channels",
                "Channel Mix"
            ]
        },
        {
            title: "Content Strategy",
            description: "You've chosen your content types to engage your audience",
            items: selectedContentTypes
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "max-w-4xl mx-auto",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "mb-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                        className: "text-2xl font-bold mb-2",
                        children: "Congratulations! Your Marketing Program is Ready"
                    }, void 0, false, {
                        fileName: "[project]/src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx",
                        lineNumber: 44,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "text-slate-600",
                        children: "You've built a comprehensive marketing program. Here's everything you've accomplished:"
                    }, void 0, false, {
                        fileName: "[project]/src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx",
                        lineNumber: 45,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx",
                lineNumber: 43,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "space-y-6",
                children: completedSteps.map((step, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "border rounded-lg p-6 bg-white hover:bg-blue-50 transition-colors",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex items-start",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-4 mt-1",
                                    children: index + 1
                                }, void 0, false, {
                                    fileName: "[project]/src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx",
                                    lineNumber: 54,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                            className: "text-xl font-semibold mb-2",
                                            children: step.title
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx",
                                            lineNumber: 58,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: "text-slate-600 mb-4",
                                            children: step.description
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx",
                                            lineNumber: 59,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex flex-wrap gap-2",
                                            children: step.items.map((item, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: "px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm",
                                                    children: item
                                                }, i, false, {
                                                    fileName: "[project]/src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx",
                                                    lineNumber: 62,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx",
                                            lineNumber: 60,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx",
                                    lineNumber: 57,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx",
                            lineNumber: 53,
                            columnNumber: 13
                        }, this)
                    }, index, false, {
                        fileName: "[project]/src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx",
                        lineNumber: 52,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx",
                lineNumber: 50,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "mt-8 p-6 border rounded-lg bg-blue-50",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                        className: "text-xl font-semibold mb-2",
                        children: "Ready to Take Action"
                    }, void 0, false, {
                        fileName: "[project]/src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx",
                        lineNumber: 74,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "text-slate-600",
                        children: 'Click "Finish Walkthrough" to start creating your content and implementing your marketing program.'
                    }, void 0, false, {
                        fileName: "[project]/src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx",
                        lineNumber: 75,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx",
                lineNumber: 73,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
};
const __TURBOPACK__default__export__ = ReviewStep;
}}),

};

//# sourceMappingURL=1ab64_components_features_MarketingWalkthrough_components_ReviewStep_index_tsx_058195._.js.map