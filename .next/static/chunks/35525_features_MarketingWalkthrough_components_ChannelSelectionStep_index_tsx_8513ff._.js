(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["static/chunks/35525_features_MarketingWalkthrough_components_ChannelSelectionStep_index_tsx_8513ff._.js", {

"[project]/src/components/features/MarketingWalkthrough/components/ChannelSelectionStep/index.tsx [client] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { r: __turbopack_require__, f: __turbopack_module_context__, i: __turbopack_import__, s: __turbopack_esm__, v: __turbopack_export_value__, n: __turbopack_export_namespace__, c: __turbopack_cache__, M: __turbopack_modules__, l: __turbopack_load__, j: __turbopack_dynamic__, P: __turbopack_resolve_absolute_path__, U: __turbopack_relative_url__, R: __turbopack_resolve_module_id_path__, b: __turbopack_worker_blob_url__, g: global, __dirname, k: __turbopack_refresh__, m: module, z: __turbopack_require_stub__ } = __turbopack_context__;
{
// ChannelSelectionStep/index.tsx
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
const channels = [
    {
        name: 'Content Marketing',
        description: 'Build authority through valuable content',
        activities: [
            'Blog Posts',
            'Whitepapers',
            'Case Studies'
        ]
    },
    {
        name: 'Digital Advertising',
        description: 'Reach target audience through paid channels',
        activities: [
            'Search Ads',
            'Display Ads',
            'Social Ads'
        ]
    },
    {
        name: 'Events',
        description: 'Connect with prospects face-to-face',
        activities: [
            'Trade Shows',
            'Webinars',
            'Workshops'
        ]
    },
    {
        name: 'Social Media',
        description: 'Engage and build community',
        activities: [
            'LinkedIn',
            'Twitter',
            'Community Management'
        ]
    }
];
const ChannelSelectionStep = ()=>{
    _s();
    const [selectedChannels, setSelectedChannels] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const toggleChannel = (channelName)=>{
        setSelectedChannels((prev)=>prev.includes(channelName) ? prev.filter((name)=>name !== channelName) : [
                ...prev,
                channelName
            ]);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-2 gap-4",
            children: channels.map((channel)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Card, {
                    className: `p-6 cursor-pointer ${selectedChannels.includes(channel.name) ? 'border-blue-500 bg-blue-50' : ''}`,
                    onClick: ()=>toggleChannel(channel.name),
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "font-semibold mb-2",
                            children: channel.name
                        }, void 0, false, {
                            fileName: "[project]/src/components/features/MarketingWalkthrough/components/ChannelSelectionStep/index.tsx",
                            lineNumber: 52,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-gray-600 text-sm mb-4",
                            children: channel.description
                        }, void 0, false, {
                            fileName: "[project]/src/components/features/MarketingWalkthrough/components/ChannelSelectionStep/index.tsx",
                            lineNumber: 53,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-wrap gap-2",
                            children: channel.activities.map((activity)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "px-2 py-1 bg-white rounded text-sm border",
                                    children: activity
                                }, activity, false, {
                                    fileName: "[project]/src/components/features/MarketingWalkthrough/components/ChannelSelectionStep/index.tsx",
                                    lineNumber: 56,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/components/features/MarketingWalkthrough/components/ChannelSelectionStep/index.tsx",
                            lineNumber: 54,
                            columnNumber: 13
                        }, this)
                    ]
                }, channel.name, true, {
                    fileName: "[project]/src/components/features/MarketingWalkthrough/components/ChannelSelectionStep/index.tsx",
                    lineNumber: 43,
                    columnNumber: 11
                }, this))
        }, void 0, false, {
            fileName: "[project]/src/components/features/MarketingWalkthrough/components/ChannelSelectionStep/index.tsx",
            lineNumber: 41,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/features/MarketingWalkthrough/components/ChannelSelectionStep/index.tsx",
        lineNumber: 40,
        columnNumber: 5
    }, this);
};
_s(ChannelSelectionStep, "1MJbOcsYkUIQlLDnqHtel+PVEbc=");
_c = ChannelSelectionStep;
const __TURBOPACK__default__export__ = ChannelSelectionStep;
var _c;
__turbopack_refresh__.register(_c, "ChannelSelectionStep");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_refresh__.registerExports(module, globalThis.$RefreshHelpers$);
}
}}),
}]);

//# sourceMappingURL=35525_features_MarketingWalkthrough_components_ChannelSelectionStep_index_tsx_8513ff._.js.map