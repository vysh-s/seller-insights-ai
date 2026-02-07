import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Sellers List
  app.get(api.sellers.list.path, async (req, res) => {
    const sellers = await storage.getSellers();
    res.json(sellers);
  });

  // Seller Details (Full)
  app.get(api.sellers.get.path, async (req, res) => {
    const seller = await storage.getSeller(req.params.id);
    if (!seller) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    res.json(seller);
  });

  // Seller Metrics
  app.get(api.sellers.metrics.path, async (req, res) => {
    const metrics = await storage.getSellerMetrics(req.params.id);
    if (!metrics) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    res.json(metrics);
  });

  // Seller Insights
  app.get(api.sellers.insights.path, async (req, res) => {
    const insights = await storage.getSellerInsights(req.params.id);
    if (!insights) {
      return res.status(404).json({ message: 'Seller not found' });
    }
    res.json(insights);
  });

  // Health Check
  app.get(api.health.check.path, async (req, res) => {
    res.json({ status: "ok" });
  });

  return httpServer;
}
