import {
  type User,
  type InsertUser,
  type Calculation,
  type InsertCalculation,
  type Template,
  type InsertTemplate,
  users,
  calculations,
  templates
} from "@shared/schema";


export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getCalculations(): Promise<Calculation[]>;
  getCalculation(id: string): Promise<Calculation | undefined>;
  createCalculation(calculation: InsertCalculation): Promise<Calculation>;
  deleteCalculation(id: string): Promise<boolean>;

  getTemplates(): Promise<Template[]>;
  getTemplate(id: string): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  deleteTemplate(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private calculations: Map<string, Calculation>;
  private templates: Map<string, Template>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.calculations = new Map();
    this.templates = new Map();
    this.currentId = 1;
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = (this.currentId++).toString();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getCalculations(): Promise<Calculation[]> {
    return Array.from(this.calculations.values()).sort((a, b) =>
      (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async getCalculation(id: string): Promise<Calculation | undefined> {
    return this.calculations.get(id);
  }

  async createCalculation(insertCalculation: InsertCalculation): Promise<Calculation> {
    const id = (this.currentId++).toString();
    const calculation: Calculation = {
      id,
      name: insertCalculation.name,
      // @ts-ignore
      products: insertCalculation.products || [],
      createdAt: new Date(),
    };
    this.calculations.set(id, calculation);
    return calculation;
  }

  async deleteCalculation(id: string): Promise<boolean> {
    return this.calculations.delete(id);
  }

  async getTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values()).sort((a, b) =>
      (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
  }

  async getTemplate(id: string): Promise<Template | undefined> {
    return this.templates.get(id);
  }

  async createTemplate(insertTemplate: InsertTemplate): Promise<Template> {
    const id = (this.currentId++).toString();
    const template: Template = {
      id,
      name: insertTemplate.name,
      description: insertTemplate.description || null,
      // @ts-ignore
      products: insertTemplate.products || [],
      createdAt: new Date(),
    };
    this.templates.set(id, template);
    return template;
  }

  async deleteTemplate(id: string): Promise<boolean> {
    return this.templates.delete(id);
  }
}

export const storage = new MemStorage();
