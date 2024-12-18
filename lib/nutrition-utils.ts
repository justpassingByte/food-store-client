import { Orders, Products } from "@/type-db";
import { getHealthProfile } from "./health-profile";

interface NutritionCheck {
  isAllergic: boolean;
  allergicIngredients: string[];
  adjustedNutrition: {
    calories: number;
    protein: number;
  };
  warnings: string[];
}

interface RelativeData {
  userId: string;
  relativeName?: string;
  relativeId?: string;
  isRelative: boolean;
}
interface DailyNutritionalLimits {
  dailyCalorieLimit: number;
  dailyProteinLimit: number;
}
interface Nutrition {
  calories: number;
  protein: number;
}
export const calculateTotalNutrition = (product: Products, qty: number): Nutrition => {
  const calories = product.calories || 0;
  const protein = product.protein || 0;

  return {
    calories: calories * qty,
    protein: protein * qty,
  };
};

export const calculateTotalNutritionCart = (products: Products[]): Nutrition => {
  return products.reduce(
    (total, product) => {
      total.calories += product.calories * product.qty;
      total.protein += product.protein * product.qty;
      return total;
    },
    { calories: 0, protein: 0 }
  );
};

export const calculateTotalNutritionFromHistory = (orders: Orders[]): Nutrition => {
  const shippedOrders = orders.filter(order => order.order_status === 'shipped');
  console.log("Shipped Orders:", shippedOrders);

  return shippedOrders.reduce(
    (total, order) => {
      const orderNutrition = order.orderItems.reduce(
        (orderTotal, product) => {
          console.log("Product Details:", product);

          const productNutrition = calculateTotalNutrition(product,product.qty || 1);
          orderTotal.calories += productNutrition.calories;
          orderTotal.protein += productNutrition.protein;
          return orderTotal;
        },
        { calories: 0, protein: 0 }
      );

      total.calories += orderNutrition.calories;
      total.protein += orderNutrition.protein;
      return total;
    },
    { calories: 0, protein: 0 }
  );
};

export const getDailyNutritionalLimits = async (id: string): Promise<DailyNutritionalLimits> => {
  try {
    const healthProfile = await getHealthProfile(id);

    if (!healthProfile) {
      console.warn('No health profile found for ID:', id);
      return {
        dailyCalorieLimit: 2000, // Giá trị mặc định
        dailyProteinLimit: 50,   // Giá trị mặc định
      };
    }

    return {
      dailyCalorieLimit: healthProfile.calories || 2000,
      dailyProteinLimit: healthProfile.protein || 50,
    };
  } catch (error) {
    console.error('Error fetching health profile:', error);
    return {
      dailyCalorieLimit: 2000, // Giá trị mặc định khi lỗi
      dailyProteinLimit: 50,
    };
  }
};
export const checkNutritionSafety = async (
  product: Products,
  relativeData: RelativeData
): Promise<NutritionCheck> => {
  try {
    console.log('Đang kiểm tra dinh dưỡng cho:', relativeData.relativeId);
    console.log('Thông tin sản phẩm:', product);

    const healthProfile = await getHealthProfile(
      relativeData.relativeId || relativeData.userId
    );
  
    if (!healthProfile) {
      console.warn('No health profile found for relative:', relativeData.relativeId);
      return {
        isAllergic: false,
        allergicIngredients: [],
        adjustedNutrition: {
          calories: product.calories || 0,
          protein: product.protein || 0
        },
        warnings: [
          "✅ Chưa có thông tin sức khỏe của người này",
          `📊 Thông tin dinh dưỡng:`,
          `    Calories: ${product.calories || 0}kcal`,
          `    Protein: ${product.protein || 0}g`,
          `    Carbs: ${product.carbs || 0}g`,
          // product.sodium ? `   • Natri: ${product.sodium}mg` : null,
          // product.saturatedFat ? `   • Chất béo bão hòa: ${product.saturatedFat}g` : null,
        ].filter(Boolean) as string[]
      };
    }
  
    const warnings: string[] = [];
    const allergicIngredients: string[] = [];

    // Kiểm tra dị ứng
    healthProfile.allergies?.forEach((allergy) => {
      if (typeof allergy === 'string') {
        if (product.ingredients.includes(allergy)) {
          allergicIngredients.push(allergy);
          warnings.push(`⚠️ Dị ứng với ${allergy}`);
        }
      } else {
        if (product.ingredients.includes(allergy.ingredient)) {
          allergicIngredients.push(allergy.ingredient);
          warnings.push(`⚠️ Dị ứng ${allergy.severity.toLowerCase()} với ${allergy.ingredient}`);
        }
      }
    });

    // Kiểm tra các bệnh và điều kiện đặc biệt
    if (healthProfile.diseases) {
      // Tiểu đường
      if (healthProfile.diseases.includes('Diabetes') && product.carbs > 30) {
        warnings.push('⚠️ Hàm lượng carbs cao (>30g) cho người tiểu đường');
      }

      // // Huyết áp cao
      // if (healthProfile.diseases.includes('HighBloodPressure') && product.sodium > 400) {
      //   warnings.push('⚠️ Hàm lượng natri cao (>400mg) cho người huyết áp cao');
      // }

      // // Bệnh thận
      // if (healthProfile.diseases.includes('KidneyDisease') && product.protein > 20) {
      //   warnings.push('⚠️ Hàm lượng protein cao (>20g) cho người bệnh thận');
      // }

      // // Bệnh tim mạch
      // if (healthProfile.diseases.includes('HeartDisease') && product.saturatedFat > 5) {
      //   warnings.push('⚠️ Hàm lượng chất béo bão hòa cao (>5g) cho người bệnh tim mạch');
      // }
    }

    // Kiểm tra giới hạn protein
    if (healthProfile.protein && product.protein > healthProfile.protein) {
      warnings.push(`⚠️ Vượt quá giới hạn protein (${product.protein}g > ${healthProfile.protein}g)`);
    }

    const adjustedNutrition = {
      calories: Math.min(
        product.calories,
        healthProfile.calories || Infinity
      ),
      protein: Math.min(
        product.protein,
        healthProfile.protein || Infinity
      )
    };

    // Thêm thông báo phù hợp nếu không có cảnh báo
    if (warnings.length === 0) {
      warnings.push('✅ Món ăn phù hợp với chế độ dinh dưỡng');
      warnings.push(`📊 Thông tin dinh dưỡng:`);
      warnings.push(`   • Calories: ${adjustedNutrition.calories || 0}kcal`);
      warnings.push(`   • Protein: ${product.protein || 0}g`);
      warnings.push(`   • Carbs: ${product.carbs || 0}g`);
      // if (product.sodium) warnings.push(`   • Natri: ${product.sodium}mg`);
      // if (product.saturatedFat) warnings.push(`   • Chất béo bão hòa: ${product.saturatedFat}g`);
    }

    return {
      isAllergic: allergicIngredients.length > 0,
      allergicIngredients,
      adjustedNutrition,
      warnings
    };
  } catch (error) {
    console.error("Error in checkNutritionSafety:", error);
    return {
      isAllergic: false,
      allergicIngredients: [],
      adjustedNutrition: {
        calories: product.calories || 0,
        protein: product.protein || 0,
      },
      warnings: [
        "✅ Chưa có thông tin sức khỏe của người này",
        `📊 Thông tin dinh dưỡng:`,
        `   • Calories: ${product.calories || 0}kcal`,
        `   • Protein: ${product.protein || 0}g`,
        `   • Carbs: ${product.carbs || 0}g`,
        // product.sodium ? `   • Natri: ${product.sodium}mg` : null,
        // product.saturatedFat ? `   • Chất béo bão hòa: ${product.saturatedFat}g` : null,
      ].filter(Boolean) as string[]
    };
  }
}; 
 