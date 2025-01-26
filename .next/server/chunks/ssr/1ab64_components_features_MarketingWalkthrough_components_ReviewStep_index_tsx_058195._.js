module.exports = {

"[project]/src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx [ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, x: __turbopack_external_require__, y: __turbopack_external_import__, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// ReviewStep/index.tsx
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
const ReviewStep = ()=>{
    const [checklist, setChecklist] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([
        {
            id: 1,
            label: 'Review goals and budget',
            completed: false
        },
        {
            id: 2,
            label: 'Confirm target persona',
            completed: false
        },
        {
            id: 3,
            label: 'Validate channel mix',
            completed: false
        },
        {
            id: 4,
            label: 'Check content strategy',
            completed: false
        },
        {
            id: 5,
            label: 'Approve timeline',
            completed: false
        }
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Card, {
                className: "p-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-semibold mb-4",
                        children: "Launch Checklist"
                    }, void 0, false, {
                        fileName: "[project]/src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx",
                        lineNumber: 17,
                        columnNumber: 8
                    }, this),
                    checklist.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            onClick: ()=>{
                                const newChecklist = checklist.map((i)=>i.id === item.id ? {
                                        ...i,
                                        completed: !i.completed
                                    } : i);
                                setChecklist(newChecklist);
                            },
                            className: "flex items-center gap-3 p-2 cursor-pointer hover:bg-gray-50",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                    type: "checkbox",
                                    checked: item.completed,
                                    readOnly: true,
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx",
                                    lineNumber: 29,
                                    columnNumber: 12
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    className: item.completed ? 'line-through text-gray-500' : '',
                                    children: item.label
                                }, void 0, false, {
                                    fileName: "[project]/src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx",
                                    lineNumber: 35,
                                    columnNumber: 12
                                }, this)
                            ]
                        }, item.id, true, {
                            fileName: "[project]/src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx",
                            lineNumber: 19,
                            columnNumber: 10
                        }, this))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx",
                lineNumber: 16,
                columnNumber: 6
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Card, {
                className: "p-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                        className: "text-lg font-semibold mb-4",
                        children: "Summary"
                    }, void 0, false, {
                        fileName: "[project]/src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx",
                        lineNumber: 43,
                        columnNumber: 8
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        children: "Total Budget:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx",
                                        lineNumber: 46,
                                        columnNumber: 12
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "font-medium",
                                        children: "$50,000"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx",
                                        lineNumber: 47,
                                        columnNumber: 12
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx",
                                lineNumber: 45,
                                columnNumber: 10
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        children: "Timeline:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx",
                                        lineNumber: 50,
                                        columnNumber: 12
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "font-medium",
                                        children: "12 months"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx",
                                        lineNumber: 51,
                                        columnNumber: 12
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx",
                                lineNumber: 49,
                                columnNumber: 10
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex justify-between",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        children: "Selected Channels:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx",
                                        lineNumber: 54,
                                        columnNumber: 12
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "font-medium",
                                        children: "4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx",
                                        lineNumber: 55,
                                        columnNumber: 12
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx",
                                lineNumber: 53,
                                columnNumber: 10
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx",
                        lineNumber: 44,
                        columnNumber: 8
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx",
                lineNumber: 42,
                columnNumber: 6
            }, this),
            checklist.every((item)=>item.completed) ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "p-4 bg-green-50 rounded-lg",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                    className: "text-sm text-green-800",
                    children: "✅ Ready to launch your marketing program!"
                }, void 0, false, {
                    fileName: "[project]/src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx",
                    lineNumber: 62,
                    columnNumber: 10
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx",
                lineNumber: 61,
                columnNumber: 8
            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "p-4 bg-blue-50 rounded-lg",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                    className: "text-sm text-blue-800",
                    children: "Complete all checklist items to launch your program."
                }, void 0, false, {
                    fileName: "[project]/src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx",
                    lineNumber: 68,
                    columnNumber: 10
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx",
                lineNumber: 67,
                columnNumber: 8
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/features/MarketingWalkthrough/components/ReviewStep/index.tsx",
        lineNumber: 15,
        columnNumber: 4
    }, this);
};
const __TURBOPACK__default__export__ = ReviewStep;
}}),

};

//# sourceMappingURL=1ab64_components_features_MarketingWalkthrough_components_ReviewStep_index_tsx_058195._.js.map