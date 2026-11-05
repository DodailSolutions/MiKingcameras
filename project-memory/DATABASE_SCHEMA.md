# MiKing's Cameras — Database Schema

**Last Updated:** October 31, 2026  
**Database:** PostgreSQL (Supabase)  
**ORM:** Prisma

---

## Entity Relationship Overview

```
Users ──┬── Roles ──── Permissions
        ├── Addresses
        ├── Orders ──┬── OrderItems ── Products
        │            ├── Payments
        │            ├── Shipments ── ShipmentEvents
        │            ├── Invoices ── InvoiceItems
        │            └── Refunds
        ├── Carts ── CartItems ── Products
        ├── Wishlists ── WishlistItems
        └── Reviews

Products ──┬── ProductVariants
           ├── ProductImages
           ├── ProductSpecifications
           ├── Categories
           ├── Brands
           └── Inventory ── Warehouses
                          └── StockMovements

Suppliers ── PurchaseOrders ── PurchaseOrderItems

CMS: CMSPages ── CMSSections
     Banners, ThemeSettings, BlogPosts

POS: POSSessions ── POSTransactions

System: AuditLogs, Notifications, SEOSettings, Redirects, IntegrationSettings, Coupons
```

---

## Prisma Schema

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

// ===========================
// AUTH & USER MANAGEMENT
// ===========================

model User {
  id              String    @id @default(cuid())
  supabaseId      String    @unique @map("supabase_id")
  email           String    @unique
  phone           String?
  firstName       String    @map("first_name")
  lastName        String    @map("last_name")
  avatarUrl       String?   @map("avatar_url")
  isActive        Boolean   @default(true) @map("is_active")
  emailVerified   Boolean   @default(false) @map("email_verified")
  phoneVerified   Boolean   @default(false) @map("phone_verified")
  lastLoginAt     DateTime? @map("last_login_at")
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")
  deletedAt       DateTime? @map("deleted_at")

  // Relations
  userRoles       UserRole[]
  addresses       Address[]
  orders          Order[]
  carts           Cart[]
  wishlists       Wishlist[]
  reviews         Review[]
  auditLogs       AuditLog[]
  notifications   Notification[]
  posSessions     POSSession[]

  @@map("users")
}

model Role {
  id          String   @id @default(cuid())
  name        String   @unique
  displayName String   @map("display_name")
  description String?
  isSystem    Boolean  @default(false) @map("is_system")
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  // Relations
  userRoles       UserRole[]
  rolePermissions RolePermission[]

  @@map("roles")
}

model Permission {
  id          String   @id @default(cuid())
  module      String   // e.g., "products", "orders", "inventory"
  action      String   // e.g., "view", "create", "edit", "delete"
  description String?
  createdAt   DateTime @default(now()) @map("created_at")

  // Relations
  rolePermissions RolePermission[]

  @@unique([module, action])
  @@map("permissions")
}

model UserRole {
  id        String   @id @default(cuid())
  userId    String   @map("user_id")
  roleId    String   @map("role_id")
  createdAt DateTime @default(now()) @map("created_at")

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  role Role @relation(fields: [roleId], references: [id], onDelete: Cascade)

  @@unique([userId, roleId])
  @@map("user_roles")
}

model RolePermission {
  id           String   @id @default(cuid())
  roleId       String   @map("role_id")
  permissionId String   @map("permission_id")
  createdAt    DateTime @default(now()) @map("created_at")

  // Relations
  role       Role       @relation(fields: [roleId], references: [id], onDelete: Cascade)
  permission Permission @relation(fields: [permissionId], references: [id], onDelete: Cascade)

  @@unique([roleId, permissionId])
  @@map("role_permissions")
}

// ===========================
// ADDRESS MANAGEMENT
// ===========================

model Address {
  id            String   @id @default(cuid())
  userId        String   @map("user_id")
  label         String?  // "Home", "Office", etc.
  fullName      String   @map("full_name")
  phone         String
  addressLine1  String   @map("address_line_1")
  addressLine2  String?  @map("address_line_2")
  landmark      String?
  city          String
  state         String
  pincode       String
  country       String   @default("India")
  isDefault     Boolean  @default(false) @map("is_default")
  gstin         String?  // For B2B customers
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")
  deletedAt     DateTime? @map("deleted_at")

  // Relations
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  billingOrders     Order[] @relation("BillingAddress")
  shippingOrders    Order[] @relation("ShippingAddress")

  @@map("addresses")
}

// ===========================
// PRODUCT MANAGEMENT
// ===========================

model Category {
  id              String    @id @default(cuid())
  name            String
  slug            String    @unique
  description     String?
  imageUrl        String?   @map("image_url")
  parentId        String?   @map("parent_id")
  sortOrder       Int       @default(0) @map("sort_order")
  isActive        Boolean   @default(true) @map("is_active")
  isFeatured      Boolean   @default(false) @map("is_featured")
  // SEO
  seoTitle        String?   @map("seo_title")
  seoDescription  String?   @map("seo_description")
  canonicalUrl    String?   @map("canonical_url")
  createdAt       DateTime  @default(now()) @map("created_at")
  updatedAt       DateTime  @updatedAt @map("updated_at")
  deletedAt       DateTime? @map("deleted_at")

  // Relations
  parent   Category?  @relation("CategoryTree", fields: [parentId], references: [id])
  children Category[] @relation("CategoryTree")
  products Product[]

  @@map("categories")
}

model Brand {
  id             String    @id @default(cuid())
  name           String
  slug           String    @unique
  description    String?
  logoUrl        String?   @map("logo_url")
  websiteUrl     String?   @map("website_url")
  isActive       Boolean   @default(true) @map("is_active")
  isFeatured     Boolean   @default(false) @map("is_featured")
  sortOrder      Int       @default(0) @map("sort_order")
  // SEO
  seoTitle       String?   @map("seo_title")
  seoDescription String?   @map("seo_description")
  createdAt      DateTime  @default(now()) @map("created_at")
  updatedAt      DateTime  @updatedAt @map("updated_at")
  deletedAt      DateTime? @map("deleted_at")

  // Relations
  products Product[]

  @@map("brands")
}

model Product {
  id                String    @id @default(cuid())
  name              String
  slug              String    @unique
  sku               String    @unique
  barcode           String?
  brandId           String    @map("brand_id")
  categoryId        String    @map("category_id")
  shortDescription  String?   @map("short_description")
  longDescription   String?   @map("long_description") @db.Text
  regularPrice      Decimal   @map("regular_price") @db.Decimal(10, 2)
  salePrice         Decimal?  @map("sale_price") @db.Decimal(10, 2)
  costPrice         Decimal?  @map("cost_price") @db.Decimal(10, 2)
  taxRate           Decimal   @default(18) @map("tax_rate") @db.Decimal(5, 2)
  hsnCode           String?   @map("hsn_code")
  weight            Decimal?  @db.Decimal(8, 3) // kg
  length            Decimal?  @db.Decimal(8, 2) // cm
  width             Decimal?  @db.Decimal(8, 2) // cm
  height            Decimal?  @db.Decimal(8, 2) // cm
  shippingClass     String?   @map("shipping_class")
  warrantyMonths    Int?      @map("warranty_months")
  returnEligible    Boolean   @default(true) @map("return_eligible")
  returnDays        Int       @default(30) @map("return_days")
  condition         ProductCondition @default(NEW)
  status            ProductStatus @default(DRAFT)
  isFeatured        Boolean   @default(false) @map("is_featured")
  isBestseller      Boolean   @default(false) @map("is_bestseller")
  isNewArrival      Boolean   @default(false) @map("is_new_arrival")
  viewCount         Int       @default(0) @map("view_count")
  // SEO
  seoTitle          String?   @map("seo_title")
  seoDescription    String?   @map("seo_description")
  canonicalUrl      String?   @map("canonical_url")
  ogImageUrl        String?   @map("og_image_url")
  // Metadata
  tags              String[]  @default([])
  createdAt         DateTime  @default(now()) @map("created_at")
  updatedAt         DateTime  @updatedAt @map("updated_at")
  deletedAt         DateTime? @map("deleted_at")

  // Relations
  brand          Brand                @relation(fields: [brandId], references: [id])
  category       Category             @relation(fields: [categoryId], references: [id])
  variants       ProductVariant[]
  images         ProductImage[]
  specifications ProductSpecification[]
  inventory      Inventory[]
  cartItems      CartItem[]
  wishlistItems  WishlistItem[]
  orderItems     OrderItem[]
  reviews        Review[]
  posTransactionItems POSTransactionItem[]

  @@index([brandId])
  @@index([categoryId])
  @@index([status])
  @@index([slug])
  @@index([sku])
  @@map("products")
}

enum ProductCondition {
  NEW
  USED_LIKE_NEW
  USED_GOOD
  USED_FAIR
  REFURBISHED
}

enum ProductStatus {
  DRAFT
  ACTIVE
  INACTIVE
  ARCHIVED
}

model ProductVariant {
  id            String   @id @default(cuid())
  productId     String   @map("product_id")
  name          String   // e.g., "Black / 128GB"
  sku           String   @unique
  barcode       String?
  regularPrice  Decimal  @map("regular_price") @db.Decimal(10, 2)
  salePrice     Decimal? @map("sale_price") @db.Decimal(10, 2)
  costPrice     Decimal? @map("cost_price") @db.Decimal(10, 2)
  weight        Decimal? @db.Decimal(8, 3)
  isActive      Boolean  @default(true) @map("is_active")
  sortOrder     Int      @default(0) @map("sort_order")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  // Variant attributes
  attributes    Json     @default("{}") // { "color": "Black", "storage": "128GB", "mount": "EF" }
  imageUrl      String?  @map("image_url")

  // Relations
  product       Product      @relation(fields: [productId], references: [id], onDelete: Cascade)
  inventory     Inventory[]
  cartItems     CartItem[]
  orderItems    OrderItem[]

  @@index([productId])
  @@map("product_variants")
}

model ProductImage {
  id         String   @id @default(cuid())
  productId  String   @map("product_id")
  url        String
  altText    String?  @map("alt_text")
  sortOrder  Int      @default(0) @map("sort_order")
  isPrimary  Boolean  @default(false) @map("is_primary")
  createdAt  DateTime @default(now()) @map("created_at")

  // Relations
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@index([productId])
  @@map("product_images")
}

model ProductSpecification {
  id        String   @id @default(cuid())
  productId String   @map("product_id")
  group     String   // e.g., "Sensor", "Display", "Battery"
  label     String   // e.g., "Resolution", "Type"
  value     String   // e.g., "24.2 MP", "APS-C CMOS"
  sortOrder Int      @default(0) @map("sort_order")
  createdAt DateTime @default(now()) @map("created_at")

  // Relations
  product Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  @@index([productId])
  @@map("product_specifications")
}

// ===========================
// INVENTORY MANAGEMENT
// ===========================

model Warehouse {
  id          String    @id @default(cuid())
  name        String
  code        String    @unique
  address     String?
  city        String?
  state       String?
  pincode     String?
  isActive    Boolean   @default(true) @map("is_active")
  isDefault   Boolean   @default(false) @map("is_default")
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")

  // Relations
  inventory      Inventory[]
  stockMovements StockMovement[]

  @@map("warehouses")
}

model Inventory {
  id              String   @id @default(cuid())
  productId       String   @map("product_id")
  variantId       String?  @map("variant_id")
  warehouseId     String   @map("warehouse_id")
  quantity        Int      @default(0)
  reservedQty     Int      @default(0) @map("reserved_qty")
  lowStockThreshold Int    @default(5) @map("low_stock_threshold")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")

  // Relations
  product   Product         @relation(fields: [productId], references: [id])
  variant   ProductVariant? @relation(fields: [variantId], references: [id])
  warehouse Warehouse       @relation(fields: [warehouseId], references: [id])

  @@unique([productId, variantId, warehouseId])
  @@index([productId])
  @@index([warehouseId])
  @@map("inventory")
}

model StockMovement {
  id           String            @id @default(cuid())
  productId    String            @map("product_id")
  variantId    String?           @map("variant_id")
  warehouseId  String            @map("warehouse_id")
  type         StockMovementType
  quantity     Int
  reference    String?           // Order ID, PO ID, etc.
  reason       String?
  notes        String?
  performedBy  String?           @map("performed_by")
  createdAt    DateTime          @default(now()) @map("created_at")

  // Relations
  warehouse Warehouse @relation(fields: [warehouseId], references: [id])

  @@index([productId])
  @@index([warehouseId])
  @@index([createdAt])
  @@map("stock_movements")
}

enum StockMovementType {
  PURCHASE
  SALE
  RETURN
  ADJUSTMENT
  TRANSFER_IN
  TRANSFER_OUT
  DAMAGED
  RESERVED
  RELEASED
}

// ===========================
// SUPPLIER & PURCHASE ORDERS
// ===========================

model Supplier {
  id           String    @id @default(cuid())
  name         String
  contactName  String?   @map("contact_name")
  email        String?
  phone        String?
  address      String?
  city         String?
  state        String?
  pincode      String?
  gstin        String?
  isActive     Boolean   @default(true) @map("is_active")
  createdAt    DateTime  @default(now()) @map("created_at")
  updatedAt    DateTime  @updatedAt @map("updated_at")
  deletedAt    DateTime? @map("deleted_at")

  // Relations
  purchaseOrders PurchaseOrder[]

  @@map("suppliers")
}

model PurchaseOrder {
  id           String              @id @default(cuid())
  orderNumber  String              @unique @map("order_number")
  supplierId   String              @map("supplier_id")
  status       PurchaseOrderStatus @default(DRAFT)
  subtotal     Decimal             @db.Decimal(12, 2)
  taxAmount    Decimal             @default(0) @map("tax_amount") @db.Decimal(10, 2)
  totalAmount  Decimal             @map("total_amount") @db.Decimal(12, 2)
  notes        String?
  orderedAt    DateTime?           @map("ordered_at")
  receivedAt   DateTime?           @map("received_at")
  createdBy    String?             @map("created_by")
  createdAt    DateTime            @default(now()) @map("created_at")
  updatedAt    DateTime            @updatedAt @map("updated_at")

  // Relations
  supplier Supplier            @relation(fields: [supplierId], references: [id])
  items    PurchaseOrderItem[]

  @@map("purchase_orders")
}

enum PurchaseOrderStatus {
  DRAFT
  ORDERED
  PARTIALLY_RECEIVED
  RECEIVED
  CANCELLED
}

model PurchaseOrderItem {
  id              String   @id @default(cuid())
  purchaseOrderId String   @map("purchase_order_id")
  productId       String   @map("product_id")
  variantId       String?  @map("variant_id")
  quantity        Int
  receivedQty     Int      @default(0) @map("received_qty")
  unitCost        Decimal  @map("unit_cost") @db.Decimal(10, 2)
  totalCost       Decimal  @map("total_cost") @db.Decimal(12, 2)
  createdAt       DateTime @default(now()) @map("created_at")

  // Relations
  purchaseOrder PurchaseOrder @relation(fields: [purchaseOrderId], references: [id], onDelete: Cascade)

  @@map("purchase_order_items")
}

// ===========================
// CART
// ===========================

model Cart {
  id        String    @id @default(cuid())
  userId    String?   @map("user_id")
  sessionId String?   @map("session_id")
  expiresAt DateTime? @map("expires_at")
  createdAt DateTime  @default(now()) @map("created_at")
  updatedAt DateTime  @updatedAt @map("updated_at")

  // Relations
  user  User?      @relation(fields: [userId], references: [id])
  items CartItem[]

  @@index([userId])
  @@index([sessionId])
  @@map("carts")
}

model CartItem {
  id        String   @id @default(cuid())
  cartId    String   @map("cart_id")
  productId String   @map("product_id")
  variantId String?  @map("variant_id")
  quantity  Int      @default(1)
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // Relations
  cart    Cart            @relation(fields: [cartId], references: [id], onDelete: Cascade)
  product Product         @relation(fields: [productId], references: [id])
  variant ProductVariant? @relation(fields: [variantId], references: [id])

  @@unique([cartId, productId, variantId])
  @@map("cart_items")
}

// ===========================
// WISHLIST
// ===========================

model Wishlist {
  id        String         @id @default(cuid())
  userId    String         @map("user_id")
  createdAt DateTime       @default(now()) @map("created_at")

  // Relations
  user  User           @relation(fields: [userId], references: [id], onDelete: Cascade)
  items WishlistItem[]

  @@unique([userId])
  @@map("wishlists")
}

model WishlistItem {
  id         String   @id @default(cuid())
  wishlistId String   @map("wishlist_id")
  productId  String   @map("product_id")
  createdAt  DateTime @default(now()) @map("created_at")

  // Relations
  wishlist Wishlist @relation(fields: [wishlistId], references: [id], onDelete: Cascade)
  product  Product  @relation(fields: [productId], references: [id])

  @@unique([wishlistId, productId])
  @@map("wishlist_items")
}

// ===========================
// ORDERS
// ===========================

model Order {
  id                String      @id @default(cuid())
  orderNumber       String      @unique @map("order_number")
  userId            String      @map("user_id")
  status            OrderStatus @default(PENDING)
  billingAddressId  String      @map("billing_address_id")
  shippingAddressId String      @map("shipping_address_id")
  subtotal          Decimal     @db.Decimal(12, 2)
  discountAmount    Decimal     @default(0) @map("discount_amount") @db.Decimal(10, 2)
  taxAmount         Decimal     @default(0) @map("tax_amount") @db.Decimal(10, 2)
  shippingAmount    Decimal     @default(0) @map("shipping_amount") @db.Decimal(10, 2)
  totalAmount       Decimal     @map("total_amount") @db.Decimal(12, 2)
  couponId          String?     @map("coupon_id")
  paymentMethod     String?     @map("payment_method")
  paymentStatus     PaymentStatus @default(PENDING) @map("payment_status")
  customerNote      String?     @map("customer_note")
  adminNote         String?     @map("admin_note")
  // Guest checkout
  guestEmail        String?     @map("guest_email")
  guestPhone        String?     @map("guest_phone")
  // Source
  source            OrderSource @default(WEBSITE)
  posSessionId      String?     @map("pos_session_id")
  // Timestamps
  paidAt            DateTime?   @map("paid_at")
  shippedAt         DateTime?   @map("shipped_at")
  deliveredAt       DateTime?   @map("delivered_at")
  cancelledAt       DateTime?   @map("cancelled_at")
  createdAt         DateTime    @default(now()) @map("created_at")
  updatedAt         DateTime    @updatedAt @map("updated_at")

  // Relations
  user            User              @relation(fields: [userId], references: [id])
  billingAddress  Address           @relation("BillingAddress", fields: [billingAddressId], references: [id])
  shippingAddress Address           @relation("ShippingAddress", fields: [shippingAddressId], references: [id])
  coupon          Coupon?           @relation(fields: [couponId], references: [id])
  items           OrderItem[]
  payments        Payment[]
  shipments       Shipment[]
  invoices        Invoice[]
  refunds         Refund[]

  @@index([userId])
  @@index([status])
  @@index([orderNumber])
  @@index([createdAt])
  @@map("orders")
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  RETURNED
  REFUNDED
}

enum PaymentStatus {
  PENDING
  PAID
  PARTIALLY_PAID
  FAILED
  REFUNDED
  PARTIALLY_REFUNDED
}

enum OrderSource {
  WEBSITE
  POS
  PHONE
  WHATSAPP
}

model OrderItem {
  id           String   @id @default(cuid())
  orderId      String   @map("order_id")
  productId    String   @map("product_id")
  variantId    String?  @map("variant_id")
  productName  String   @map("product_name")
  variantName  String?  @map("variant_name")
  sku          String
  quantity     Int
  unitPrice    Decimal  @map("unit_price") @db.Decimal(10, 2)
  taxRate      Decimal  @map("tax_rate") @db.Decimal(5, 2)
  taxAmount    Decimal  @map("tax_amount") @db.Decimal(10, 2)
  discount     Decimal  @default(0) @db.Decimal(10, 2)
  totalPrice   Decimal  @map("total_price") @db.Decimal(12, 2)
  hsnCode      String?  @map("hsn_code")
  createdAt    DateTime @default(now()) @map("created_at")

  // Relations
  order   Order           @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product Product         @relation(fields: [productId], references: [id])
  variant ProductVariant? @relation(fields: [variantId], references: [id])

  @@map("order_items")
}

// ===========================
// PAYMENTS
// ===========================

model Payment {
  id                  String        @id @default(cuid())
  orderId             String        @map("order_id")
  gateway             String        // "razorpay", "cashfree", "cod"
  gatewayOrderId      String?       @map("gateway_order_id")
  gatewayPaymentId    String?       @map("gateway_payment_id")
  gatewaySignature    String?       @map("gateway_signature")
  method              String?       // "upi", "card", "netbanking", "wallet", "cod"
  amount              Decimal       @db.Decimal(12, 2)
  currency            String        @default("INR")
  status              PaymentTxStatus @default(CREATED)
  errorCode           String?       @map("error_code")
  errorDescription    String?       @map("error_description")
  metadata            Json?
  idempotencyKey      String?       @unique @map("idempotency_key")
  createdAt           DateTime      @default(now()) @map("created_at")
  updatedAt           DateTime      @updatedAt @map("updated_at")

  // Relations
  order Order @relation(fields: [orderId], references: [id])

  @@index([orderId])
  @@index([gatewayOrderId])
  @@index([gatewayPaymentId])
  @@map("payments")
}

enum PaymentTxStatus {
  CREATED
  AUTHORIZED
  CAPTURED
  FAILED
  REFUNDED
  PARTIALLY_REFUNDED
}

model Refund {
  id                String       @id @default(cuid())
  orderId           String       @map("order_id")
  paymentId         String?      @map("payment_id")
  gateway           String?
  gatewayRefundId   String?      @map("gateway_refund_id")
  amount            Decimal      @db.Decimal(12, 2)
  reason            String?
  status            RefundStatus @default(PENDING)
  processedBy       String?      @map("processed_by")
  processedAt       DateTime?    @map("processed_at")
  createdAt         DateTime     @default(now()) @map("created_at")
  updatedAt         DateTime     @updatedAt @map("updated_at")

  // Relations
  order Order @relation(fields: [orderId], references: [id])

  @@index([orderId])
  @@map("refunds")
}

enum RefundStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}

// ===========================
// SHIPPING
// ===========================

model Shipment {
  id              String          @id @default(cuid())
  orderId         String          @map("order_id")
  provider        String?         // "shiprocket", "delhivery", "bluedart", "manual"
  providerOrderId String?         @map("provider_order_id")
  awbNumber       String?         @map("awb_number")
  trackingUrl     String?         @map("tracking_url")
  labelUrl        String?         @map("label_url")
  status          ShipmentStatus  @default(PENDING)
  weight          Decimal?        @db.Decimal(8, 3)
  dimensions      Json?           // { length, width, height }
  shippingCost    Decimal?        @map("shipping_cost") @db.Decimal(10, 2)
  estimatedDelivery DateTime?     @map("estimated_delivery")
  pickedUpAt      DateTime?       @map("picked_up_at")
  deliveredAt     DateTime?       @map("delivered_at")
  createdAt       DateTime        @default(now()) @map("created_at")
  updatedAt       DateTime        @updatedAt @map("updated_at")

  // Relations
  order  Order           @relation(fields: [orderId], references: [id])
  events ShipmentEvent[]

  @@index([orderId])
  @@index([awbNumber])
  @@map("shipments")
}

enum ShipmentStatus {
  PENDING
  PICKUP_SCHEDULED
  PICKED_UP
  IN_TRANSIT
  OUT_FOR_DELIVERY
  DELIVERED
  RETURNED
  CANCELLED
}

model ShipmentEvent {
  id          String   @id @default(cuid())
  shipmentId  String   @map("shipment_id")
  status      String
  location    String?
  description String?
  eventTime   DateTime @map("event_time")
  createdAt   DateTime @default(now()) @map("created_at")

  // Relations
  shipment Shipment @relation(fields: [shipmentId], references: [id], onDelete: Cascade)

  @@index([shipmentId])
  @@map("shipment_events")
}

// ===========================
// COUPONS & DISCOUNTS
// ===========================

model Coupon {
  id              String     @id @default(cuid())
  code            String     @unique
  description     String?
  type            CouponType
  value           Decimal    @db.Decimal(10, 2)
  minOrderAmount  Decimal?   @map("min_order_amount") @db.Decimal(10, 2)
  maxDiscount     Decimal?   @map("max_discount") @db.Decimal(10, 2)
  usageLimit      Int?       @map("usage_limit")
  usedCount       Int        @default(0) @map("used_count")
  perUserLimit    Int        @default(1) @map("per_user_limit")
  isActive        Boolean    @default(true) @map("is_active")
  startsAt        DateTime?  @map("starts_at")
  expiresAt       DateTime?  @map("expires_at")
  createdAt       DateTime   @default(now()) @map("created_at")
  updatedAt       DateTime   @updatedAt @map("updated_at")

  // Relations
  orders Order[]

  @@map("coupons")
}

enum CouponType {
  PERCENTAGE
  FIXED
  FREE_SHIPPING
}

// ===========================
// REVIEWS
// ===========================

model Review {
  id         String       @id @default(cuid())
  productId  String       @map("product_id")
  userId     String       @map("user_id")
  rating     Int          // 1-5
  title      String?
  comment    String?      @db.Text
  images     String[]     @default([])
  status     ReviewStatus @default(PENDING)
  isVerified Boolean      @default(false) @map("is_verified")
  createdAt  DateTime     @default(now()) @map("created_at")
  updatedAt  DateTime     @updatedAt @map("updated_at")

  // Relations
  product Product @relation(fields: [productId], references: [id])
  user    User    @relation(fields: [userId], references: [id])

  @@unique([productId, userId])
  @@index([productId])
  @@map("reviews")
}

enum ReviewStatus {
  PENDING
  APPROVED
  REJECTED
}

// ===========================
// INVOICES & BILLING
// ===========================

model Invoice {
  id              String        @id @default(cuid())
  invoiceNumber   String        @unique @map("invoice_number")
  orderId         String        @map("order_id")
  type            InvoiceType   @default(TAX_INVOICE)
  // Business details
  businessName    String        @map("business_name")
  businessGstin   String?       @map("business_gstin")
  businessAddress String?       @map("business_address")
  // Customer details
  customerName    String        @map("customer_name")
  customerGstin   String?       @map("customer_gstin")
  customerAddress String?       @map("customer_address")
  // Amounts
  subtotal        Decimal       @db.Decimal(12, 2)
  discountAmount  Decimal       @default(0) @map("discount_amount") @db.Decimal(10, 2)
  taxableAmount   Decimal       @map("taxable_amount") @db.Decimal(12, 2)
  cgst            Decimal       @default(0) @db.Decimal(10, 2)
  sgst            Decimal       @default(0) @db.Decimal(10, 2)
  igst            Decimal       @default(0) @db.Decimal(10, 2)
  shippingAmount  Decimal       @default(0) @map("shipping_amount") @db.Decimal(10, 2)
  totalAmount     Decimal       @map("total_amount") @db.Decimal(12, 2)
  // PDF
  pdfUrl          String?       @map("pdf_url")
  // Status
  status          InvoiceStatus @default(GENERATED)
  emailSentAt     DateTime?     @map("email_sent_at")
  createdAt       DateTime      @default(now()) @map("created_at")
  updatedAt       DateTime      @updatedAt @map("updated_at")

  // Relations
  order       Order          @relation(fields: [orderId], references: [id])
  items       InvoiceItem[]
  creditNotes CreditNote[]

  @@index([orderId])
  @@map("invoices")
}

enum InvoiceType {
  TAX_INVOICE
  PROFORMA
  CREDIT_NOTE
}

enum InvoiceStatus {
  GENERATED
  SENT
  PAID
  CANCELLED
}

model InvoiceItem {
  id          String   @id @default(cuid())
  invoiceId   String   @map("invoice_id")
  description String
  hsnCode     String?  @map("hsn_code")
  quantity    Int
  unitPrice   Decimal  @map("unit_price") @db.Decimal(10, 2)
  taxRate     Decimal  @map("tax_rate") @db.Decimal(5, 2)
  taxAmount   Decimal  @map("tax_amount") @db.Decimal(10, 2)
  totalPrice  Decimal  @map("total_price") @db.Decimal(12, 2)
  createdAt   DateTime @default(now()) @map("created_at")

  // Relations
  invoice Invoice @relation(fields: [invoiceId], references: [id], onDelete: Cascade)

  @@map("invoice_items")
}

model CreditNote {
  id            String   @id @default(cuid())
  creditNumber  String   @unique @map("credit_number")
  invoiceId     String   @map("invoice_id")
  amount        Decimal  @db.Decimal(12, 2)
  reason        String?
  pdfUrl        String?  @map("pdf_url")
  createdAt     DateTime @default(now()) @map("created_at")

  // Relations
  invoice Invoice @relation(fields: [invoiceId], references: [id])

  @@map("credit_notes")
}

// ===========================
// POS — POINT OF SALE
// ===========================

model POSSession {
  id           String          @id @default(cuid())
  operatorId   String          @map("operator_id")
  terminalName String?         @map("terminal_name")
  status       POSSessionStatus @default(OPEN)
  openingCash  Decimal         @default(0) @map("opening_cash") @db.Decimal(10, 2)
  closingCash  Decimal?        @map("closing_cash") @db.Decimal(10, 2)
  totalSales   Decimal         @default(0) @map("total_sales") @db.Decimal(12, 2)
  totalRefunds Decimal         @default(0) @map("total_refunds") @db.Decimal(12, 2)
  openedAt     DateTime        @default(now()) @map("opened_at")
  closedAt     DateTime?       @map("closed_at")
  createdAt    DateTime        @default(now()) @map("created_at")

  // Relations
  operator     User              @relation(fields: [operatorId], references: [id])
  transactions POSTransaction[]

  @@index([operatorId])
  @@map("pos_sessions")
}

enum POSSessionStatus {
  OPEN
  CLOSED
  RECONCILED
}

model POSTransaction {
  id            String             @id @default(cuid())
  sessionId     String             @map("session_id")
  transactionNo String             @unique @map("transaction_no")
  customerName  String?            @map("customer_name")
  customerPhone String?            @map("customer_phone")
  subtotal      Decimal            @db.Decimal(12, 2)
  taxAmount     Decimal            @default(0) @map("tax_amount") @db.Decimal(10, 2)
  discountAmount Decimal           @default(0) @map("discount_amount") @db.Decimal(10, 2)
  totalAmount   Decimal            @map("total_amount") @db.Decimal(12, 2)
  paymentMethod String             @map("payment_method") // "cash", "upi", "card"
  amountPaid    Decimal            @map("amount_paid") @db.Decimal(12, 2)
  changeGiven   Decimal            @default(0) @map("change_given") @db.Decimal(10, 2)
  status        POSTransactionStatus @default(COMPLETED)
  orderId       String?            @map("order_id") // Links to Order if synced
  createdAt     DateTime           @default(now()) @map("created_at")

  // Relations
  session POSSession          @relation(fields: [sessionId], references: [id])
  items   POSTransactionItem[]

  @@index([sessionId])
  @@map("pos_transactions")
}

enum POSTransactionStatus {
  COMPLETED
  REFUNDED
  PARTIALLY_REFUNDED
  VOIDED
}

model POSTransactionItem {
  id            String   @id @default(cuid())
  transactionId String   @map("transaction_id")
  productId     String   @map("product_id")
  variantId     String?  @map("variant_id")
  productName   String   @map("product_name")
  sku           String
  quantity      Int
  unitPrice     Decimal  @map("unit_price") @db.Decimal(10, 2)
  discount      Decimal  @default(0) @db.Decimal(10, 2)
  taxAmount     Decimal  @map("tax_amount") @db.Decimal(10, 2)
  totalPrice    Decimal  @map("total_price") @db.Decimal(12, 2)
  createdAt     DateTime @default(now()) @map("created_at")

  // Relations
  transaction POSTransaction @relation(fields: [transactionId], references: [id], onDelete: Cascade)
  product     Product        @relation(fields: [productId], references: [id])

  @@map("pos_transaction_items")
}

// ===========================
// CMS
// ===========================

model CMSPage {
  id            String    @id @default(cuid())
  title         String
  slug          String    @unique
  content       Json?     // Rich content blocks
  isPublished   Boolean   @default(false) @map("is_published")
  publishedAt   DateTime? @map("published_at")
  seoTitle      String?   @map("seo_title")
  seoDescription String?  @map("seo_description")
  ogImageUrl    String?   @map("og_image_url")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  deletedAt     DateTime? @map("deleted_at")

  // Relations
  sections CMSSection[]

  @@map("cms_pages")
}

model CMSSection {
  id        String   @id @default(cuid())
  pageId    String   @map("page_id")
  type      String   // "hero", "featured_categories", "product_grid", "banner", "testimonials", etc.
  title     String?
  config    Json     // Section-specific configuration
  sortOrder Int      @default(0) @map("sort_order")
  isActive  Boolean  @default(true) @map("is_active")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  // Relations
  page CMSPage @relation(fields: [pageId], references: [id], onDelete: Cascade)

  @@index([pageId])
  @@map("cms_sections")
}

model Banner {
  id          String    @id @default(cuid())
  title       String
  subtitle    String?
  imageUrl    String    @map("image_url")
  mobileImageUrl String? @map("mobile_image_url")
  linkUrl     String?   @map("link_url")
  position    String    // "homepage_hero", "homepage_mid", "category_top", etc.
  sortOrder   Int       @default(0) @map("sort_order")
  isActive    Boolean   @default(true) @map("is_active")
  startsAt    DateTime? @map("starts_at")
  expiresAt   DateTime? @map("expires_at")
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")

  @@map("banners")
}

model ThemeSetting {
  id        String   @id @default(cuid())
  key       String   @unique
  value     Json
  group     String   // "colors", "typography", "layout", "header", "footer"
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("theme_settings")
}

// ===========================
// BLOG
// ===========================

model BlogPost {
  id             String    @id @default(cuid())
  title          String
  slug           String    @unique
  excerpt        String?
  content        String    @db.Text
  featuredImage  String?   @map("featured_image")
  authorId       String    @map("author_id")
  category       String?
  tags           String[]  @default([])
  isPublished    Boolean   @default(false) @map("is_published")
  publishedAt    DateTime? @map("published_at")
  seoTitle       String?   @map("seo_title")
  seoDescription String?   @map("seo_description")
  createdAt      DateTime  @default(now()) @map("created_at")
  updatedAt      DateTime  @updatedAt @map("updated_at")
  deletedAt      DateTime? @map("deleted_at")

  @@map("blog_posts")
}

// ===========================
// SEO
// ===========================

model SEOSetting {
  id        String   @id @default(cuid())
  key       String   @unique
  value     String   @db.Text
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("seo_settings")
}

model Redirect {
  id          String   @id @default(cuid())
  fromPath    String   @unique @map("from_path")
  toPath      String   @map("to_path")
  statusCode  Int      @default(301) @map("status_code")
  isActive    Boolean  @default(true) @map("is_active")
  createdAt   DateTime @default(now()) @map("created_at")

  @@map("redirects")
}

// ===========================
// SYSTEM
// ===========================

model AuditLog {
  id          String   @id @default(cuid())
  userId      String?  @map("user_id")
  action      String   // "product.create", "order.update", "user.login"
  entityType  String?  @map("entity_type")
  entityId    String?  @map("entity_id")
  oldValues   Json?    @map("old_values")
  newValues   Json?    @map("new_values")
  ipAddress   String?  @map("ip_address")
  userAgent   String?  @map("user_agent")
  createdAt   DateTime @default(now()) @map("created_at")

  // Relations
  user User? @relation(fields: [userId], references: [id])

  @@index([userId])
  @@index([action])
  @@index([entityType, entityId])
  @@index([createdAt])
  @@map("audit_logs")
}

model Notification {
  id        String             @id @default(cuid())
  userId    String             @map("user_id")
  type      String             // "order", "shipment", "promotion", "system"
  title     String
  message   String
  link      String?
  isRead    Boolean            @default(false) @map("is_read")
  createdAt DateTime           @default(now()) @map("created_at")

  // Relations
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([createdAt])
  @@map("notifications")
}

model IntegrationSetting {
  id        String   @id @default(cuid())
  provider  String   // "razorpay", "cashfree", "shiprocket", "meta", "whatsapp"
  key       String
  value     String   @db.Text
  isActive  Boolean  @default(true) @map("is_active")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@unique([provider, key])
  @@map("integration_settings")
}

// ===========================
// NEWSLETTER
// ===========================

model NewsletterSubscriber {
  id           String   @id @default(cuid())
  email        String   @unique
  isActive     Boolean  @default(true) @map("is_active")
  subscribedAt DateTime @default(now()) @map("subscribed_at")
  unsubscribedAt DateTime? @map("unsubscribed_at")

  @@map("newsletter_subscribers")
}
```

---

## Key Design Decisions

1. **Soft Deletion:** Used for Products, Categories, Brands, Suppliers, Addresses, CMS Pages, Blog Posts (via `deletedAt` field)
2. **Order Item Snapshot:** Order items store product name, variant name, SKU, and price at time of purchase (not referencing live product data for price)
3. **Decimal for Money:** All monetary fields use `Decimal(10,2)` or `Decimal(12,2)` to avoid floating point issues
4. **GST Fields:** Invoices have separate CGST, SGST, IGST fields for Indian GST compliance
5. **Inventory Reservation:** `reservedQty` field in Inventory for checkout concurrency safety
6. **Audit Trail:** StockMovement tracks every inventory change with type, reference, and performer
7. **Multi-Warehouse:** Inventory is warehouse-specific from the start
8. **POS Integration:** POS transactions optionally link to Orders for unified reporting
9. **CMS Flexibility:** CMS sections use JSON config for schema-driven rendering
10. **Idempotency:** Payment model has `idempotencyKey` to prevent duplicate processing
