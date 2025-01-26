(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/35525_features_MarketingWalkthrough_components_TimelinePlanningStep_index_tsx_12b829._.js", {

"[project]/src/components/features/MarketingWalkthrough/components/TimelinePlanningStep/index.tsx [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// TimelinePlanningStep/index.tsx
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
const TimelinePlanningStep = ()=>{
    _s();
    const [events, setEvents] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const addEvent = ()=>{
        setEvents([
            ...events,
            {
                name: '',
                quarter: 1,
                type: 'Content'
            }
        ]);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-4 gap-4",
                children: [
                    1,
                    2,
                    3,
                    4
                ].map((quarter)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                        className: "p-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-semibold mb-4",
                                children: [
                                    "Q",
                                    quarter
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/features/MarketingWalkthrough/components/TimelinePlanningStep/index.tsx",
                                lineNumber: 23,
                                columnNumber: 13
                            }, this),
                            events.filter((event)=>event.quarter === quarter).map((event, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-2 p-2 bg-gray-50 rounded",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            value: event.name,
                                            onChange: (e)=>{
                                                const newEvents = [
                                                    ...events
                                                ];
                                                newEvents[events.indexOf(event)].name = e.target.value;
                                                setEvents(newEvents);
                                            },
                                            className: "w-full p-1 border rounded mb-1",
                                            placeholder: "Event name"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/features/MarketingWalkthrough/components/TimelinePlanningStep/index.tsx",
                                            lineNumber: 28,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                            value: event.type,
                                            onChange: (e)=>{
                                                const newEvents = [
                                                    ...events
                                                ];
                                                newEvents[events.indexOf(event)].type = e.target.value;
                                                setEvents(newEvents);
                                            },
                                            className: "w-full p-1 border rounded",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    children: "Content"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/features/MarketingWalkthrough/components/TimelinePlanningStep/index.tsx",
                                                    lineNumber: 47,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    children: "Event"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/features/MarketingWalkthrough/components/TimelinePlanningStep/index.tsx",
                                                    lineNumber: 48,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                    children: "Campaign"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/features/MarketingWalkthrough/components/TimelinePlanningStep/index.tsx",
                                                    lineNumber: 49,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/features/MarketingWalkthrough/components/TimelinePlanningStep/index.tsx",
                                            lineNumber: 38,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, index, true, {
                                    fileName: "[project]/src/components/features/MarketingWalkthrough/components/TimelinePlanningStep/index.tsx",
                                    lineNumber: 27,
                                    columnNumber: 17
                                }, this))
                        ]
                    }, quarter, true, {
                        fileName: "[project]/src/components/features/MarketingWalkthrough/components/TimelinePlanningStep/index.tsx",
                        lineNumber: 22,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/features/MarketingWalkthrough/components/TimelinePlanningStep/index.tsx",
                lineNumber: 20,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: addEvent,
                className: "w-full p-3 border-2 border-dashed border-gray-300 rounded-lg",
                children: "+ Add Event"
            }, void 0, false, {
                fileName: "[project]/src/components/features/MarketingWalkthrough/components/TimelinePlanningStep/index.tsx",
                lineNumber: 56,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/features/MarketingWalkthrough/components/TimelinePlanningStep/index.tsx",
        lineNumber: 19,
        columnNumber: 5
    }, this);
};
_s(TimelinePlanningStep, "fh+hzEDekCPeegwQh0J56A4r3Ew=");
_c = TimelinePlanningStep;
const __TURBOPACK__default__export__ = TimelinePlanningStep;
var _c;
__turbopack_refresh__.register(_c, "TimelinePlanningStep");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=35525_features_MarketingWalkthrough_components_TimelinePlanningStep_index_tsx_12b829._.js.map