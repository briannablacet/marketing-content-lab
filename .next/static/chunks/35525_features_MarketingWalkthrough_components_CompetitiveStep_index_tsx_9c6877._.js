(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/35525_features_MarketingWalkthrough_components_CompetitiveStep_index_tsx_9c6877._.js", {

"[project]/src/components/features/MarketingWalkthrough/components/CompetitiveStep/index.tsx [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// CompetitiveStep/index.tsx
__turbopack_esm__({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_import__("[project]/node_modules/react/index.js [client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '@/components/ui/card'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
var _s = __turbopack_refresh__.signature();
;
;
const CompetitiveStep = ()=>{
    _s();
    const [competitors, setCompetitors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([
        {
            name: '',
            strengths: '',
            weaknesses: ''
        }
    ]);
    const addCompetitor = ()=>{
        setCompetitors([
            ...competitors,
            {
                name: '',
                strengths: '',
                weaknesses: ''
            }
        ]);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            competitors.map((competitor, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                    className: "p-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-lg font-semibold mb-4",
                            children: [
                                "Competitor ",
                                index + 1
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/features/MarketingWalkthrough/components/CompetitiveStep/index.tsx",
                            lineNumber: 18,
                            columnNumber: 10
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium mb-1",
                                            children: "Name"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/features/MarketingWalkthrough/components/CompetitiveStep/index.tsx",
                                            lineNumber: 21,
                                            columnNumber: 14
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            value: competitor.name,
                                            onChange: (e)=>{
                                                const newCompetitors = [
                                                    ...competitors
                                                ];
                                                newCompetitors[index].name = e.target.value;
                                                setCompetitors(newCompetitors);
                                            },
                                            className: "w-full p-2 border rounded"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/features/MarketingWalkthrough/components/CompetitiveStep/index.tsx",
                                            lineNumber: 22,
                                            columnNumber: 14
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/features/MarketingWalkthrough/components/CompetitiveStep/index.tsx",
                                    lineNumber: 20,
                                    columnNumber: 12
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium mb-1",
                                            children: "Strengths"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/features/MarketingWalkthrough/components/CompetitiveStep/index.tsx",
                                            lineNumber: 34,
                                            columnNumber: 14
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            value: competitor.strengths,
                                            onChange: (e)=>{
                                                const newCompetitors = [
                                                    ...competitors
                                                ];
                                                newCompetitors[index].strengths = e.target.value;
                                                setCompetitors(newCompetitors);
                                            },
                                            className: "w-full p-2 border rounded",
                                            rows: 3
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/features/MarketingWalkthrough/components/CompetitiveStep/index.tsx",
                                            lineNumber: 35,
                                            columnNumber: 14
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/features/MarketingWalkthrough/components/CompetitiveStep/index.tsx",
                                    lineNumber: 33,
                                    columnNumber: 12
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                            className: "block text-sm font-medium mb-1",
                                            children: "Weaknesses"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/features/MarketingWalkthrough/components/CompetitiveStep/index.tsx",
                                            lineNumber: 47,
                                            columnNumber: 14
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                            value: competitor.weaknesses,
                                            onChange: (e)=>{
                                                const newCompetitors = [
                                                    ...competitors
                                                ];
                                                newCompetitors[index].weaknesses = e.target.value;
                                                setCompetitors(newCompetitors);
                                            },
                                            className: "w-full p-2 border rounded",
                                            rows: 3
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/features/MarketingWalkthrough/components/CompetitiveStep/index.tsx",
                                            lineNumber: 48,
                                            columnNumber: 14
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/features/MarketingWalkthrough/components/CompetitiveStep/index.tsx",
                                    lineNumber: 46,
                                    columnNumber: 12
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/features/MarketingWalkthrough/components/CompetitiveStep/index.tsx",
                            lineNumber: 19,
                            columnNumber: 10
                        }, this)
                    ]
                }, index, true, {
                    fileName: "[project]/src/components/features/MarketingWalkthrough/components/CompetitiveStep/index.tsx",
                    lineNumber: 17,
                    columnNumber: 8
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: addCompetitor,
                className: "w-full p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-500 hover:text-blue-500",
                children: "+ Add Another Competitor"
            }, void 0, false, {
                fileName: "[project]/src/components/features/MarketingWalkthrough/components/CompetitiveStep/index.tsx",
                lineNumber: 62,
                columnNumber: 6
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/features/MarketingWalkthrough/components/CompetitiveStep/index.tsx",
        lineNumber: 15,
        columnNumber: 4
    }, this);
};
_s(CompetitiveStep, "XB0jtfVfCFxVkyfGxSAXFuKFKzo=");
_c = CompetitiveStep;
const __TURBOPACK__default__export__ = CompetitiveStep;
var _c;
__turbopack_refresh__.register(_c, "CompetitiveStep");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=35525_features_MarketingWalkthrough_components_CompetitiveStep_index_tsx_9c6877._.js.map