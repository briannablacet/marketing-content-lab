// src/services/ContentLibraryService.ts
class ContentLibraryService {
    searchContent(query: string, filters?: any) {
        try {
            const items = JSON.parse(localStorage.getItem('contentLibrary') || '[]');
            return items;
        } catch {
            return [];
        }
    }

    getAllContent() {
        return JSON.parse(localStorage.getItem('contentLibrary') || '[]');
    }

    getStats() {
        const items = this.getAllContent();
        const totalWords = items.reduce((sum: number, item: any) => sum + (item.wordCount || 0), 0);

        return {
            total: items.length,
            favorites: items.filter((item: any) => item.isFavorite).length,
            recentlyAdded: items.filter((item: any) => {
                const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                return new Date(item.createdAt) >= oneWeekAgo;
            }).length,
            totalWords: totalWords, // ADD THIS
            byType: items.reduce((acc: any, item: any) => {
                acc[item.contentType] = (acc[item.contentType] || 0) + 1;
                return acc;
            }, {})
        };
    }
}

export default new ContentLibraryService();