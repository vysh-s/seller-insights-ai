import { type User, type InsertUser, type Seller, type SellerSummary, type SellerMetrics, type SellerInsights } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Seller Methods
  getSellers(): Promise<SellerSummary[]>;
  getSeller(id: string): Promise<Seller | undefined>;
  getSellerMetrics(id: string): Promise<SellerMetrics | undefined>;
  getSellerInsights(id: string): Promise<SellerInsights | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private sellers: Map<string, Seller>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
    this.sellers = new Map();
    this.initializeSellers();
  }

  private initializeSellers() {
    const rawData = [
      {
        "seller_id": "seller_0",
        "business_name": "Bean There Coffee",
        "industry": "coffee_shop",
        "metrics": {
          "total_transactions": 145,
          "completed_transactions": 142,
          "completion_rate": 97.9,
          "cancellation_rate": 1.4,
          "failure_rate": 0.7,
          "total_revenue": 1234.56,
          "average_transaction_value": 8.70,
          "repeat_customer_rate": 65.5,
          "average_processing_time_seconds": 3.2
        },
        "insights": {
          "overall_health": "excellent",
          "key_finding": "Strong repeat customer base but processing times could be faster",
          "insights": [
            {
              "title": "Strong Repeat Customer Rate",
              "current_state": "65.5% repeat customer rate",
              "benchmark": "Industry average for coffee shops: 45%",
              "recommendation": "Continue excellent customer experience. Consider loyalty program to increase to 70%+",
              "expected_impact": "+10% more visits per customer"
            },
            {
              "title": "Processing Time Opportunity",
              "current_state": "3.2 seconds average",
              "benchmark": "Industry average: 2.5 seconds",
              "recommendation": "Optimize payment processing (consider faster terminals)",
              "expected_impact": "+5% customer satisfaction"
            }
          ],
          "priority_action": "Implement a simple loyalty program to capitalize on your strong repeat customer base"
        }
      },
      {
        "seller_id": "seller_1",
        "business_name": "Bloom Boutique",
        "industry": "fashion",
        "metrics": {
          "total_transactions": 87,
          "completed_transactions": 74,
          "completion_rate": 85.1,
          "cancellation_rate": 10.3,
          "failure_rate": 4.6,
          "total_revenue": 5920.45,
          "average_transaction_value": 80.01,
          "repeat_customer_rate": 38.2,
          "average_processing_time_seconds": 8.1
        },
        "insights": {
          "overall_health": "concerning",
          "key_finding": "High cancellation rate is leaving revenue on the table",
          "insights": [
            {
              "title": "High Cancellation Rate",
              "current_state": "10.3% cancellation rate",
              "benchmark": "Industry average for fashion: 7-8%",
              "recommendation": "Reduce shipping costs or offer free shipping on orders over $75. Most cancellations happen at checkout.",
              "expected_impact": "Could recover +$600/month in lost revenue"
            },
            {
              "title": "Low Repeat Customer Rate",
              "current_state": "38.2% repeat rate",
              "benchmark": "Top performers: 55-60%",
              "recommendation": "Send post-purchase follow-up emails with styling tips. Create email marketing campaign.",
              "expected_impact": "+15% repeat purchases"
            }
          ],
          "priority_action": "Immediately test free shipping on orders over $75 to reduce checkout abandonment"
        }
      },
      {
        "seller_id": "seller_2",
        "business_name": "Tech Repairs Pro",
        "industry": "electronics_repair",
        "metrics": {
          "total_transactions": 62,
          "completed_transactions": 59,
          "completion_rate": 95.2,
          "cancellation_rate": 3.2,
          "failure_rate": 1.6,
          "total_revenue": 8850.00,
          "average_transaction_value": 150.00,
          "repeat_customer_rate": 35.5,
          "average_processing_time_seconds": 9.8
        },
        "insights": {
          "overall_health": "good",
          "key_finding": "High-value transactions with room for retention",
          "insights": [
            {
              "title": "High Transaction Value",
              "current_state": "$150 average per transaction",
              "benchmark": "Industry average: $130",
              "recommendation": "You're pricing correctly. Focus on upselling repair warranties.",
              "expected_impact": "+12% average transaction value"
            }
          ],
          "priority_action": "Create a warranty program and push it in follow-up emails"
        }
      },
      {
        "seller_id": "seller_3",
        "business_name": "Yoga & Wellness",
        "industry": "fitness",
        "metrics": {
          "total_transactions": 128,
          "completed_transactions": 118,
          "completion_rate": 92.2,
          "cancellation_rate": 5.5,
          "failure_rate": 2.3,
          "total_revenue": 14160.00,
          "average_transaction_value": 120.00,
          "repeat_customer_rate": 52.3,
          "average_processing_time_seconds": 5.2
        },
        "insights": {
          "overall_health": "good",
          "key_finding": "Solid fundamentals with room to optimize",
          "insights": [
            {
              "title": "Moderate Repeat Rate",
              "current_state": "52.3% repeat customer rate",
              "benchmark": "Top yoga studios: 65-70%",
              "recommendation": "Introduce a punch card or membership discount for 10+ classes",
              "expected_impact": "+15% repeat bookings"
            }
          ],
          "priority_action": "Launch a membership program for committed yogis"
        }
      },
      {
        "seller_id": "seller_4",
        "business_name": "Artisan Bakery",
        "industry": "food",
        "metrics": {
          "total_transactions": 156,
          "completed_transactions": 150,
          "completion_rate": 96.2,
          "cancellation_rate": 2.6,
          "failure_rate": 1.3,
          "total_revenue": 3750.00,
          "average_transaction_value": 25.00,
          "repeat_customer_rate": 48.1,
          "average_processing_time_seconds": 4.1
        },
        "insights": {
          "overall_health": "excellent",
          "key_finding": "High completion rate. Focus on scaling.",
          "insights": [
            {
              "title": "Excellent Conversion",
              "current_state": "96.2% completion rate",
              "benchmark": "Industry average: 92%",
              "recommendation": "You're doing great. Scale marketing spend to drive more traffic.",
              "expected_impact": "+30% monthly revenue"
            }
          ],
          "priority_action": "Scale paid advertising (Instagram/Facebook ads) - your conversion is strong"
        }
      },
      {
        "seller_id": "seller_5",
        "business_name": "Digital Marketing Hub",
        "industry": "services",
        "metrics": {
          "total_transactions": 42,
          "completed_transactions": 38,
          "completion_rate": 90.5,
          "cancellation_rate": 7.1,
          "failure_rate": 2.4,
          "total_revenue": 11400.00,
          "average_transaction_value": 300.00,
          "repeat_customer_rate": 42.9,
          "average_processing_time_seconds": 15.3
        },
        "insights": {
          "overall_health": "good",
          "key_finding": "High-ticket service with B2B challenges",
          "insights": [
            {
              "title": "High Processing Time",
              "current_state": "15.3 seconds per transaction",
              "benchmark": "Services average: 10-12 seconds",
              "recommendation": "Implement streamlined intake forms. Reduce decision paralysis.",
              "expected_impact": "+8% conversion rate"
            }
          ],
          "priority_action": "Simplify your booking/payment flow for clients"
        }
      },
      {
        "seller_id": "seller_6",
        "business_name": "Vintage Vinyl Records",
        "industry": "retail",
        "metrics": {
          "total_transactions": 73,
          "completed_transactions": 64,
          "completion_rate": 87.7,
          "cancellation_rate": 9.6,
          "failure_rate": 2.7,
          "total_revenue": 2880.00,
          "average_transaction_value": 45.00,
          "repeat_customer_rate": 34.2,
          "average_processing_time_seconds": 6.2
        },
        "insights": {
          "overall_health": "concerning",
          "key_finding": "Niche market with retention challenges",
          "insights": [
            {
              "title": "Low Repeat Rate",
              "current_state": "34.2% repeat rate",
              "benchmark": "Retail average: 40-45%",
              "recommendation": "Create a vinyl collector's club with monthly surprise recommendations",
              "expected_impact": "+25% repeat purchases"
            }
          ],
          "priority_action": "Start a monthly vinyl recommendation email to engage collectors"
        }
      },
      {
        "seller_id": "seller_7",
        "business_name": "Nail Haven",
        "industry": "beauty",
        "metrics": {
          "total_transactions": 94,
          "completed_transactions": 87,
          "completion_rate": 92.6,
          "cancellation_rate": 5.3,
          "failure_rate": 2.1,
          "total_revenue": 5655.00,
          "average_transaction_value": 65.00,
          "repeat_customer_rate": 59.6,
          "average_processing_time_seconds": 5.1
        },
        "insights": {
          "overall_health": "excellent",
          "key_finding": "Beauty loyalty model working well",
          "insights": [
            {
              "title": "Strong Repeat Customer Base",
              "current_state": "59.6% repeat rate",
              "benchmark": "Beauty industry: 50-55%",
              "recommendation": "You're above average. Implement tiered loyalty rewards.",
              "expected_impact": "+20% lifetime customer value"
            }
          ],
          "priority_action": "Launch VIP loyalty tier for customers with 10+ visits"
        }
      },
      {
        "seller_id": "seller_8",
        "business_name": "Furniture Craftsman",
        "industry": "furniture",
        "metrics": {
          "total_transactions": 18,
          "completed_transactions": 15,
          "completion_rate": 83.3,
          "cancellation_rate": 11.1,
          "failure_rate": 5.6,
          "total_revenue": 7500.00,
          "average_transaction_value": 500.00,
          "repeat_customer_rate": 22.2,
          "average_processing_time_seconds": 22.5
        },
        "insights": {
          "overall_health": "concerning",
          "key_finding": "High-ticket items with long decision cycles",
          "insights": [
            {
              "title": "High Cancellation Rate for High-Ticket Items",
              "current_state": "11.1% cancellation rate",
              "benchmark": "Furniture industry: 8-10%",
              "recommendation": "Reduce friction: offer payment plans, free consultations, money-back guarantees",
              "expected_impact": "Could recover +$1000/month in cancelled orders"
            }
          ],
          "priority_action": "Implement 'no questions asked' 30-day money-back guarantee and payment plans"
        }
      },
      {
        "seller_id": "seller_9",
        "business_name": "Local Gym Plus",
        "industry": "fitness",
        "metrics": {
          "total_transactions": 110,
          "completed_transactions": 101,
          "completion_rate": 91.8,
          "cancellation_rate": 6.4,
          "failure_rate": 1.8,
          "total_revenue": 12120.00,
          "average_transaction_value": 120.00,
          "repeat_customer_rate": 58.2,
          "average_processing_time_seconds": 5.4
        },
        "insights": {
          "overall_health": "good",
          "key_finding": "Strong membership base with growth opportunity",
          "insights": [
            {
              "title": "Above-Average Repeat Rate",
              "current_state": "58.2% repeat rate",
              "benchmark": "Gym average: 45-50%",
              "recommendation": "Members are sticking around. Introduce premium tier with personal training.",
              "expected_impact": "+25% AOV (higher-tier memberships)"
            }
          ],
          "priority_action": "Upsell premium memberships to your best retention cohort"
        }
      }
    ] as any[]; // Type cast to any first to match the exact JSON structure before strict typing if needed

    rawData.forEach(seller => {
      // Validate with schema to ensure types
      // const validated = sellerSchema.parse(seller); 
      // Using 'as Seller' for now since we know it matches
      this.sellers.set(seller.seller_id, seller as Seller);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getSellers(): Promise<SellerSummary[]> {
    return Array.from(this.sellers.values()).map(seller => ({
      seller_id: seller.seller_id,
      business_name: seller.business_name,
      industry: seller.industry
    }));
  }

  async getSeller(id: string): Promise<Seller | undefined> {
    return this.sellers.get(id);
  }

  async getSellerMetrics(id: string): Promise<SellerMetrics | undefined> {
    const seller = this.sellers.get(id);
    return seller?.metrics;
  }

  async getSellerInsights(id: string): Promise<SellerInsights | undefined> {
    const seller = this.sellers.get(id);
    return seller?.insights;
  }
}

export const storage = new MemStorage();
