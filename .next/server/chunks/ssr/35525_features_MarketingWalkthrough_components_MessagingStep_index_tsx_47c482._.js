module.exports = {

"[project]/src/components/features/MarketingWalkthrough/components/MessagingStep/index.tsx [ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// MessagingStep/index.tsx
__turbopack_esm__({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_import__("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_import__("[externals]/react [external] (react, cjs)");
(()=>{
    const e = new Error("Cannot find module '@/components/ui/card'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
;
const MessagingStep = ()=>{
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        valueProposition: '',
        differentiators: [
            '',
            '',
            ''
        ],
        keyBenefits: [
            '',
            '',
            ''
        ]
    });
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Card, {
                className: "p-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-semibold mb-4",
                        children: "Value Proposition"
                    }, void 0, false, {
                        fileName: "[project]/src/components/features/MarketingWalkthrough/components/MessagingStep/index.tsx",
                        lineNumber: 15,
                        columnNumber: 8
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                        value: messages.valueProposition,
                        onChange: (e)=>setMessages({
                                ...messages,
                                valueProposition: e.target.value
                            }),
                        className: "w-full p-2 border rounded",
                        rows: 4,
                        placeholder: "What makes your solution extraordinary?"
                    }, void 0, false, {
                        fileName: "[project]/src/components/features/MarketingWalkthrough/components/MessagingStep/index.tsx",
                        lineNumber: 16,
                        columnNumber: 8
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/features/MarketingWalkthrough/components/MessagingStep/index.tsx",
                lineNumber: 14,
                columnNumber: 6
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Card, {
                className: "p-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-semibold mb-4",
                        children: "Key Differentiators"
                    }, void 0, false, {
                        fileName: "[project]/src/components/features/MarketingWalkthrough/components/MessagingStep/index.tsx",
                        lineNumber: 26,
                        columnNumber: 8
                    }, this),
                    messages.differentiators.map((diff, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "mb-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                value: diff,
                                onChange: (e)=>{
                                    const newDiffs = [
                                        ...messages.differentiators
                                    ];
                                    newDiffs[index] = e.target.value;
                                    setMessages({
                                        ...messages,
                                        differentiators: newDiffs
                                    });
                                },
                                className: "w-full p-2 border rounded",
                                placeholder: `Differentiator ${index + 1}`
                            }, void 0, false, {
                                fileName: "[project]/src/components/features/MarketingWalkthrough/components/MessagingStep/index.tsx",
                                lineNumber: 29,
                                columnNumber: 12
                            }, this)
                        }, index, false, {
                            fileName: "[project]/src/components/features/MarketingWalkthrough/components/MessagingStep/index.tsx",
                            lineNumber: 28,
                            columnNumber: 10
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/features/MarketingWalkthrough/components/MessagingStep/index.tsx",
                lineNumber: 25,
                columnNumber: 6
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Card, {
                className: "p-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-semibold mb-4",
                        children: "Key Benefits"
                    }, void 0, false, {
                        fileName: "[project]/src/components/features/MarketingWalkthrough/components/MessagingStep/index.tsx",
                        lineNumber: 44,
                        columnNumber: 8
                    }, this),
                    messages.keyBenefits.map((benefit, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "mb-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                value: benefit,
                                onChange: (e)=>{
                                    const newBenefits = [
                                        ...messages.keyBenefits
                                    ];
                                    newBenefits[index] = e.target.value;
                                    setMessages({
                                        ...messages,
                                        keyBenefits: newBenefits
                                    });
                                },
                                className: "w-full p-2 border rounded",
                                placeholder: `Benefit ${index + 1}`
                            }, void 0, false, {
                                fileName: "[project]/src/components/features/MarketingWalkthrough/components/MessagingStep/index.tsx",
                                lineNumber: 47,
                                columnNumber: 12
                            }, this)
                        }, index, false, {
                            fileName: "[project]/src/components/features/MarketingWalkthrough/components/MessagingStep/index.tsx",
                            lineNumber: 46,
                            columnNumber: 10
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/features/MarketingWalkthrough/components/MessagingStep/index.tsx",
                lineNumber: 43,
                columnNumber: 6
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/features/MarketingWalkthrough/components/MessagingStep/index.tsx",
        lineNumber: 13,
        columnNumber: 4
    }, this);
};
const __TURBOPACK__default__export__ = MessagingStep;
}}),

};

//# sourceMappingURL=35525_features_MarketingWalkthrough_components_MessagingStep_index_tsx_47c482._.js.map