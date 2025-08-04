# Vouchers Management Module

This folder contains all components and logic related to promotion/voucher management.

## Folder Structure

```
vouchers/
├── index.js                 # Main export
├── Vouchers.jsx            # Main vouchers management component
└── components/
    ├── index.js            # Components export
    ├── PromotionDetailModal.jsx    # Modal for viewing promotion details
    └── PromotionFormModal.jsx      # Modal for creating/editing promotions
```

## Components

### Vouchers.jsx
- Main table view for promotions management
- Handles CRUD operations (Create, Read, Update, Delete)
- Includes filtering, searching, and pagination
- Statistics dashboard with cards

### PromotionDetailModal
- Displays detailed information about a promotion
- Shows usage statistics with progress bars
- Date information and product details
- Read-only view with edit button

### PromotionFormModal  
- Form for creating new promotions or editing existing ones
- Form validation with Zod schema
- Dynamic product selection for PRODUCT_DISCOUNT type
- Supports all promotion types (USER_PROMOTION, PRODUCT_DISCOUNT, GIFT, SHOP_DISCOUNT)

## Usage

```jsx
import Vouchers from './pages/admin/vouchers';

// Or import individual components
import { PromotionDetailModal, PromotionFormModal } from './pages/admin/vouchers/components';
```

## API Integration

The module uses the following APIs from `~/apis/promotionApi`:
- `apiGetPromotions` - Get paginated list of promotions
- `apiCreatePromotion` - Create new promotion
- `apiUpdatePromotion` - Update existing promotion  
- `apiDeletePromotion` - Delete promotion
- `apiGetProductsForPromotion` - Get products for selection (PRODUCT_DISCOUNT type)
