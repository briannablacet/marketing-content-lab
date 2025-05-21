class StrategicDataService {
    private static instance: StrategicDataService;
    private data: any = {};

    private constructor() {
        // Initialize data from localStorage if available
        const savedData = localStorage.getItem('strategicData');
        if (savedData) {
            this.data = JSON.parse(savedData);
        }
    }

    public static getInstance(): StrategicDataService {
        if (!StrategicDataService.instance) {
            StrategicDataService.instance = new StrategicDataService();
        }
        return StrategicDataService.instance;
    }

    private saveToLocalStorage() {
        localStorage.setItem('strategicData', JSON.stringify(this.data));
    }

    // Product Info
    public getProductInfo() {
        return this.data.productInfo || {};
    }

    public setProductInfo(info: any) {
        this.data.productInfo = info;
        this.saveToLocalStorage();
    }

    // Persona
    public getPersona() {
        return this.data.persona || {};
    }

    public setPersona(persona: any) {
        this.data.persona = persona;
        this.saveToLocalStorage();
    }

    // Tagline
    public getTagline() {
        return this.data.tagline || '';
    }

    public setTagline(tagline: string) {
        this.data.tagline = tagline;
        this.saveToLocalStorage();
    }

    // Boilerplates
    public getBoilerplates() {
        return this.data.boilerplates || { short: '', medium: '', long: '' };
    }

    public setBoilerplates(boilerplates: any) {
        this.data.boilerplates = boilerplates;
        this.saveToLocalStorage();
    }

    // Messaging Framework
    public getMessagingFramework() {
        return this.data.messagingFramework || {};
    }

    public setMessagingFramework(framework: any) {
        this.data.messagingFramework = framework;
        this.saveToLocalStorage();
    }

    // Mission & Vision
    public getMission() {
        return this.data.mission || '';
    }

    public setMission(mission: string) {
        this.data.mission = mission;
        this.saveToLocalStorage();
    }

    public getVision() {
        return this.data.vision || '';
    }

    public setVision(vision: string) {
        this.data.vision = vision;
        this.saveToLocalStorage();
    }

    // Generic data getter/setter
    public getData(key: string) {
        return this.data[key];
    }

    public setData(key: string, value: any) {
        this.data[key] = value;
        this.saveToLocalStorage();
    }

    static async getTargetAudiences() {
        try {
            const data = localStorage.getItem('marketingAudiences');
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error getting target audiences:', error);
            return [];
        }
    }

    static async getCompetitiveAnalysis() {
        try {
            const data = localStorage.getItem('marketingCompetitors');
            return data ? JSON.parse(data) : [];
        } catch (error) {
            console.error('Error getting competitive analysis:', error);
            return [];
        }
    }

    static async getStyleGuide() {
        try {
            const data = localStorage.getItem('marketingStyleGuide');
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Error getting style guide:', error);
            return null;
        }
    }

    static setStrategicDataValue(key: string, value: any) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error setting ${key}:`, error);
        }
    }
}

export default StrategicDataService.getInstance(); 