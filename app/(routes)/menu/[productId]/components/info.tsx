"use client"
import { Button } from "@/components/ui/button"
import useCarts from "@/hooks/usecart"
import { cn } from "@/lib/utils"
import { Orders, Products } from "@/type-db"
import { CookingPot, CreditCard, ShoppingCart, Soup, SquareActivity, Utensils, Search, Loader2, X } from "lucide-react"
import { useState, useEffect, useCallback, useMemo } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { calculateTotalNutrition, calculateTotalNutritionFromHistory, checkNutritionSafety } from "@/lib/nutrition-utils"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useAuth } from "@clerk/nextjs"
import axios from 'axios'
import { Input } from "@/components/ui/input"
import Modal from "./modal"
import debounce from 'lodash/debounce'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ShieldAlert } from "lucide-react"
import getOrders from "@/action/get-orders"
import { getDailyNutritionalLimits } from "@/lib/nutrition-utils"
import ModalWarn from "./modalWarning"

interface InfoProps {
  product: Products
}
interface NutritionInfo {
  totalCaloriesToday: number;
  dailyCalorieLimit: number;
  totalProteinToday: number;
  dailyProteinLimit: number;
  consumedCalories: number;
  consumedProtein: number;
}

// Thêm interface cho RelativePerson
interface RelativePerson {
  id: string;
  name: string;
  email?: string;
}

// Thêm interface cho kết quả kiểm tra dinh dưỡng
interface NutritionCheck {
  isAllergic: boolean;
  allergicIngredients: string[];
  adjustedNutrition: {
    calories: number;
    protein: number;
  };
  warnings: string[];
}

// Sửa lại interface Relative
interface Relative {
  isRegistered: any
  relativeName: string
  age: number
  gender: string
  allergies: []
  email: string;
  userId: string;
  name: string;
}

// Sửa lại interface cho kết quả tìm kiếm
interface SearchResult {
  name: string;
  email: string;
  userId: string;  // đảm bảo có trường này
}

const Info = ({ product }: InfoProps) => {
  const [qty, setQty] = useState(1)
  const cart = useCarts()
  const handleQty = (num: number) => {
    setQty(num)
    cart.updateQuantity(product.id, num)
  }
  const addToCart = (data: Products) => {
    cart.addItem({ ...data, qty: qty })
  }
  const [selectedRelative, setSelectedRelative] = useState<string>('')
  const [relatives, setRelatives] = useState<Relative[]>([])
  const [searchEmail, setSearchEmail] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()
  const { userId } = useAuth()
  const [savedRelatives, setSavedRelatives] = useState<RelativePerson[]>([])
  const [selectedPerson, setSelectedPerson] = useState<string>('self');
  const [showRelatives, setShowRelatives] = useState(false);
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [nutritionWarnings, setNutritionWarnings] = useState<NutritionCheck | null>(null);

  // Thêm useEffect để tải danh sách người thân đã lưu
  useEffect(() => {
    const loadRelatives = async () => {
      if (userId && showRelatives) {
        console.log('Loading relatives for user:', userId);
        await fetchRelatives();
      }
    };

    loadRelatives();
  }, [userId, showRelatives]);

  const fetchRelatives = async () => {
    if (!userId) return;

    console.log('Fetching relatives for userId:', userId);
    try {
      const response = await axios.get(`/api/users/${userId}/relatives`);
      console.log('API Response:', response.data);

      if (response.data?.relatives) {
        setRelatives(response.data.relatives);
      } else {
        setRelatives([]);
      }
    } catch (error) {
      console.error('Error fetching relatives:', error);
      toast.error('Không thể tải danh sách người thân');
    }
  };

  // Thêm hàm để thêm người thân mới
  const addNewRelative = async (name: string, email: string, relativeUserId: string) => {
    if (!userId) {
      console.error('Current user ID is missing');
      return;
    }

    try {
      // Log dữ liệu trước khi gửi request
      console.log('Adding relative with data:', {
        currentUserId: userId,
        relativeData: {
          name,
          email,
          userId: relativeUserId
        }
      });

      const response = await axios.post(`/api/users/${userId}/relatives`, {
        name,
        email,
        userId: relativeUserId, // userId của người thân
        currentUserId: userId // thêm userId của người đang đăng nhập
      });

      console.log('Add relative response:', response.data);

      if (response.data.success) {
        await fetchRelatives();
        toast.success('Đã thêm người thân thành công');
        setIsModalOpen(false);
        setSearchTerm('');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error details:', error.response?.data || error);
      toast.error('Không thể thêm người thân');
    }
  };

  // Tạo debounced search function
  const debouncedSearch = useMemo(
    () =>
      debounce(async (searchValue: string) => {
        if (!searchValue.trim()) {
          setSearchResults([]);
          return;
        }

        console.log('Searching for:', searchValue);
        setIsSearching(true);
        try {
          const response = await axios.get(`/api/users/search?email=${encodeURIComponent(searchValue)}`);
          console.log('Search response:', response.data);
          // Đảm bảo response.data.users có đầy đủ thông tin
          setSearchResults(response.data.users || []);
        } catch (error) {
          console.error('Lỗi tìm kiếm:', error);
          toast.error("Không thể tìm thấy người dùng");
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 500),
    []
  );

  // Cleanup debounce khi component unmount
  useEffect(() => {
    return () => {
      debouncedSearch.cancel()
    }
  }, [debouncedSearch])



  const [open, setOpen] = useState(false);
  const [nutritionInfo, setNutritionInfo] = useState<NutritionInfo>({
    totalCaloriesToday: 0,
    dailyCalorieLimit: 0,
    totalProteinToday: 0,
    dailyProteinLimit: 0,
    consumedCalories: 0,
    consumedProtein: 0,
  });


  const onCheckoutSelf = async () => {
    try {
      if (!userId) {
        toast.error("Vui lòng đăng nhập để đặt hàng");
        return;
      }

      const orders = await fetchOrderHistory();

      if (!Array.isArray(orders)) {
        throw new Error("Lịch sử đặt hàng không hợp lệ");
      }

      const totalNutritionHistory = calculateTotalNutritionFromHistory(orders);
      const totalNutrition = calculateTotalNutrition(product, qty);

      const totalCaloriesToday = totalNutritionHistory.calories + totalNutrition.calories;
      const totalProteinToday = totalNutritionHistory.protein + totalNutrition.protein;

      const { dailyCalorieLimit, dailyProteinLimit } = await getDailyNutritionalLimits(userId);

      setNutritionInfo({
        totalCaloriesToday,
        dailyCalorieLimit,
        totalProteinToday,
        dailyProteinLimit,
        consumedCalories: totalNutritionHistory.calories,
        consumedProtein: totalNutritionHistory.protein,
      });

      setOpen(true);
      await processOrder('SELF');
    } catch (error) {
      toast.error("Đã có lỗi xảy ra");
      console.error(error);
    }
  };


  // Cập nhật hàm fetchOrderHistory để chỉ lấy đơn hàng trong ngày
  const fetchOrderHistory = async () => {
    if (!userId) return 0; // Nếu không có userId, trả về 0

    try {

      // Gửi yêu cầu API với timestamp
      const response = await getOrders(userId)

      return response; // Giả sử API trả về danh sách đơn hàng
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử đặt hàng:", error);
      return [];
    }
  };

  const handleOrderForRelative = async () => {
    try {
      if (!userId) {
        toast.error("Vui lòng đăng nhập để đặt hàng");
        return;
      }

      if (!selectedRelative) {
        toast.error("Vui lòng chọn người nhận");
        return;
      }

      // Lấy lịch sử đặt hàng thành công
      const orders = await fetchOrderHistory();
      // Kiểm tra nếu orders là một mảng hợp lệ
      if (!Array.isArray(orders)) {
        throw new Error("Lịch sử đặt hàng không hợp lệ");
      }
      const totalNutritionHistory = calculateTotalNutritionFromHistory(orders);

      const totalNutrition = calculateTotalNutrition(product, qty);

      const totalCaloriesToday = totalNutritionHistory.calories + totalNutrition.calories;
      const totalProteinToday = totalNutritionHistory.protein + totalNutrition.protein;

      const { dailyCalorieLimit, dailyProteinLimit } = await getDailyNutritionalLimits(selectedRelative);

      console.log("Total Calories Today:", totalCaloriesToday);
      console.log("Total Protein Today:", totalProteinToday);
      console.log("Calorie Limit:", dailyCalorieLimit);
      console.log("Protein Limit:", dailyProteinLimit);

      // Kiểm tra giới hạn calo và protein
      if (totalCaloriesToday > dailyCalorieLimit || totalProteinToday > dailyProteinLimit) {
        const confirmIgnore = window.confirm(
          `Tổng lượng dinh dưỡng vượt quá giới hạn hàng ngày (${dailyCalorieLimit} calo, ${dailyProteinLimit}g protein). Bạn có muốn tiếp tục?`
        );
        if (!confirmIgnore) {
          return; // Dừng quy trình thanh toán nếu không muốn bỏ qua
        }
      }

      // Tiếp tục đặt hàng
      await processOrder('RELATIVE');
    } catch (error) {
      console.error("Lỗi khi đặt hàng:", error);
      toast.error("Đã có lỗi xảy ra khi đặt hàng");
    }
  };



  // Tách riêng phần xử lý thanh toán
  const processOrder = async (
    orderType: 'SELF' | 'RELATIVE',
    ignoreWarning: boolean = false
  ) => {
    try {
      console.log(
        `Bắt đầu xử lý đơn hàng cho: ${orderType === 'RELATIVE' ? selectedRelative : userId}`
      );
  
      const payload = {
        products: [{ ...product, qty }],
        userId: orderType === 'RELATIVE' ? selectedRelative : userId,
        orderedBy: userId,
        orderType,
        ignoreWarning,
      };
  
      const response = await axios.post(
        'http://localhost:3001/api/T5efehVuTKiOIPOhWgjq/checkout',
        payload
      );
  
      window.location = response.data.url;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || 'Lỗi xử lý đơn hàng');
      } else {
        toast.error('Lỗi xử lý đơn hàng');
      }
      console.error(error);
    }
  };
  

  // Sửa lại handler cho Select của shadcn/ui
  const handlePersonChange = async (value: string) => {
    console.log('handlePersonChange called with value:', value)
    setSelectedPerson(value)

    if (value === 'relative') {
      console.log('Setting showRelatives to true')
      setShowRelatives(true)
      await fetchRelatives()
    } else {
      setShowRelatives(false)
    }
  }



  // Thêm component AddRelativeModal vào trong component Info
  const AddRelativeModal = useCallback(() => {
    return (
      <Modal
        title="Thêm người thân"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <div className="p-4">
          <div className="relative">
            <Input
              placeholder="Tìm kiếm email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                debouncedSearch(e.target.value)
              }}
              className="w-full"
              autoFocus
            />
            {isSearching && (
              <div className="absolute right-3 top-3">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
            )}
          </div>

          {/* Phần hiển thị kết quả */}
          <div className="mt-4 space-y-2">
            {searchTerm && !isSearching && searchResults.length === 0 && (
              <div className="text-sm text-gray-500 text-center py-2">
                Không tìm thấy người dùng
              </div>
            )}

            {searchResults.map((result) => (
              <div
                key={result.userId}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{result.name}</p>
                  <p className="text-sm text-gray-500">{result.email}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    addNewRelative(result.name, result.email, result.userId)
                    setIsModalOpen(false)
                    setSearchTerm('')
                    setSearchResults([])
                  }}
                >
                  Thêm
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    )
  }, [isModalOpen, searchTerm, isSearching, searchResults, debouncedSearch, addNewRelative])

  // Thêm phần hiển thị cảnh báo dinh dưỡng vào giao diện
  const renderNutritionWarnings = () => {
    if (!nutritionWarnings) return null;

    return (
      <Alert variant="destructive" className="mt-4">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Cảnh báo dinh dưỡng</AlertTitle>
        <AlertDescription>
          <ul className="list-none pl-4 mt-2">
            {nutritionWarnings.isAllergic && (
              <li>
                Dị ứng với: {nutritionWarnings.allergicIngredients.join(", ")}
              </li>
            )}
            {nutritionWarnings.warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
          <Button
            onClick={() => processOrder('RELATIVE')}
            variant="outline"
            className="mt-4"
          >
            Vẫn tiếp tục đặt hàng
          </Button>
        </AlertDescription>
      </Alert>
    );
  };

  // Sửa lại phần xử lý khi chọn người thân
  const handleRelativeSelect = async (relativeId: string) => {
    setSelectedRelative(relativeId)

    try {
      // Tìm relative được chọn
      const selectedRel = relatives.find(rel =>
        rel.isRegistered ? rel.userId === relativeId : rel.relativeName === relativeId
      );

      if (!selectedRel) {
        throw new Error("Không tìm thấy thông tin người thân");
      }

      const safetyCheck = await checkNutritionSafety(product, {
        userId: userId || '',
        relativeName: selectedRel.isRegistered ? undefined : selectedRel.relativeName,
        relativeId: selectedRel.isRegistered ? selectedRel.userId : undefined,
        isRelative: true
      })
      setNutritionWarnings(safetyCheck)
    } catch (error) {
      console.error("Lỗi khi kiểm tra dinh dưỡng:", error)
      toast.error("Không thể kiểm tra thông tin dinh dưỡng")
    }
  }
  useEffect(() => {
    const fetchNutritionalLimits = async () => {
      if (!userId) {
        console.warn("User ID is missing.");
        return;
      }
      try {
        // Lấy lịch sử đặt hàng thành công
        const orders = await fetchOrderHistory();
        // Kiểm tra nếu orders là một mảng hợp lệ
        if (!Array.isArray(orders)) {
          throw new Error("Lịch sử đặt hàng không hợp lệ");
        }
        const totalNutrition = calculateTotalNutrition(product, qty);
        const totalNutritionHistory = calculateTotalNutritionFromHistory(orders);

        const totalCaloriesToday = totalNutritionHistory.calories + totalNutrition.calories;
        const totalProteinToday = totalNutritionHistory.protein + totalNutrition.protein;
        const { dailyCalorieLimit, dailyProteinLimit } = await getDailyNutritionalLimits(userId);

        console.log("Total Nutrition from history:", totalNutritionHistory);

        console.log("TotalNutrition Of product:", totalNutrition);

        console.log("Calorie Limit:", dailyCalorieLimit);
        console.log("Protein Limit:", dailyProteinLimit);
      } catch (error) {
        console.error("Error fetching nutritional limits:", error);
      }
    };

    fetchNutritionalLimits();
  }, [userId, qty]);

  return (

    <div className="p-4 space-y-6">
      <ModalWarn isOpen={open} onClose={() => setOpen(false)}>
        <h2 className="text-xl font-bold text-gray-900">Thông tin dinh dưỡng</h2>

        {/* Product Info Section */}
        <div className="mt-4 text-gray-700">
          <div className="font-semibold text-lg">Thông tin món ăn:</div>
          <p className="mt-2"><strong>Tên món:</strong> {product.name}</p>
          <p><strong>Protein:</strong> {product.protein}g</p>
          <p><strong>Calo:</strong> {product.calories} cal</p>
        </div>

        {/* Nutritional Limits Section */}
        <div className="mt-4 text-gray-700">
          <p><strong>Tổng calo giới hạn:</strong> {nutritionInfo.dailyCalorieLimit} calo</p>
          <p><strong>Tổng protein giới hạn:</strong> {nutritionInfo.dailyProteinLimit} g</p>
          <p><strong>Đã tiêu thụ:</strong> {nutritionInfo.consumedCalories} calo, {nutritionInfo.consumedProtein}g protein</p>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <Button onClick={onCheckoutSelf} className="bg-green-500 text-white">
            Tiếp tục thanh toán
          </Button>
          <Button onClick={() => setOpen(false)} variant="ghost" className="text-gray-500">
            Điều chỉnh lại
          </Button>
        </div>
      </ModalWarn>


      <h1 className="text-3xl font-bold text-neutral-800">{product.name}</h1>

      {/* Product Info Section */}
      <div className="space-y-4">
        <div className="text-neutral-600">
          {product.description}
          <div className="mt-2">
            <span className="font-semibold">Thành phần:</span> {product.ingredients}
          </div>
          <div className="mt-2">
            <span className="font-semibold">Protein:</span> {product.protein}g
          </div>
          <div className="mt-2">
            <span className="font-semibold">Calo:</span> {product.calories} cal
          </div>
        </div>

        {/* Tags Section */}
        <div className="flex flex-wrap gap-2">
          {product.cuisine && (
            <Badge variant="secondary" className="flex items-center gap-2">
              <CookingPot className="w-4 h-4" />
              {product.cuisine}
            </Badge>
          )}
          {product.category && (
            <Badge variant="secondary" className="flex items-center gap-2">
              <Soup className="w-4 h-4" />
              {product.category}
            </Badge>
          )}
          {product.size && (
            <Badge variant="secondary" className="flex items-center gap-2">
              <SquareActivity className="w-4 h-4" />
              {product.size}
            </Badge>
          )}
          {product.kitchen && (
            <Badge variant="secondary" className="flex items-center gap-2">
              <Utensils className="w-4 h-4" />
              {product.kitchen}
            </Badge>
          )}
        </div>
      </div>

      {/* Quantity and Price Section */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-lg font-semibold mb-2">Giá</p>
          <p className="text-2xl font-bold">${product.price}</p>
        </div>
        <div>
          <p className="text-lg font-semibold mb-2">Số lượng</p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map(num => (
              <button
                key={num}
                onClick={() => handleQty(num)}
                className={cn(
                  "w-10 h-10 rounded-full border border-hero transition-all",
                  qty === num ? "bg-hero text-white" : "bg-transparent text-hero"
                )}
              >
                {num}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-4">
        {/* Container cho các nút */}
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          {/* Container cho select */}
          <div className="w-full sm:w-[240px]">
            <Select
              value={selectedPerson}
              onValueChange={handlePersonChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn người đặt">
                  {selectedPerson === 'self' ? (
                    <span className="flex items-center">
                      🙋‍♂️ Đặt cho bản thân
                    </span>
                  ) : (
                    <span className="flex items-center">
                      👥 Đặt cho người thân
                    </span>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="self">🙋‍♂️ Đặt cho bản thân</SelectItem>
                <SelectItem value="relative">👥 Đặt cho người thân</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Nút thêm vào giỏ */}
          <Button
            onClick={() => {
              addToCart(product)
              toast.success("Đã thêm vào giỏ hàng")
            }}
            variant="outline"
            className="w-full sm:w-[160px] border-blue-600 text-blue-600 hover:bg-blue-50"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            <span>Thêm vào giỏ</span>
          </Button>

          {/* Nút thanh toán */}
          <Button
            onClick={() => selectedPerson === 'self' ? onCheckoutSelf() : handleOrderForRelative()}
            className="w-full sm:w-[160px] bg-blue-600 hover:bg-blue-700"
          >
            <CreditCard className="mr-2 h-5 w-5" />
            <span>Thanh toán ngay</span>
          </Button>
        </div>
        {/* Phần danh sách người thân */}
        {showRelatives && (
          <div className="mt-6 bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">Chọn người thân:</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(true)}
                  className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:text-blue-700"
                >
                  + Thêm người thân
                </Button>
              </div>
            </div>

            <div className="p-6">
              {relatives && relatives.length > 0 ? (
                <div className="space-y-3">
                  {relatives.map((relative) => (
                    <div
                      key={relative.isRegistered ? relative.userId : relative.relativeName}
                      className={cn(
                        "flex items-center gap-4 p-4 rounded-lg border transition-all cursor-pointer hover:bg-gray-50",
                        selectedRelative === (relative.isRegistered ? relative.userId : relative.relativeName)
                          ? "bg-blue-50 border-blue-200"
                          : "bg-white border-gray-200"
                      )}
                      onClick={() => handleRelativeSelect(relative.isRegistered ? relative.userId : relative.relativeName)}
                    >
                      <input
                        type="radio"
                        name="selectedRelative"
                        checked={selectedRelative === (relative.isRegistered ? relative.userId : relative.relativeName)}
                        onChange={() => handleRelativeSelect(relative.isRegistered ? relative.userId : relative.relativeName)}
                        className="w-4 h-4 text-blue-600"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-medium text-gray-800">
                            {relative.isRegistered ? relative.name : relative.relativeName}
                          </p>
                          {relative.isRegistered ? (
                            <Badge variant="success" className="text-xs">Đã đăng ký</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">Chưa đăng ký</Badge>
                          )}
                        </div>
                        {relative.isRegistered && (
                          <p className="text-sm text-gray-500">{relative.email}</p>
                        )}
                        {!relative.isRegistered && (
                          <div className="text-sm text-gray-500">
                            <p>Tuổi: {relative.age} | Giới tính: {relative.gender}</p>
                            {relative.allergies && (
                              <p>Dị ứng: {relative.allergies.join(', ')}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">Chưa có người thân nào</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsModalOpen(true)}
                    className="mt-2"
                  >
                    Thêm người thân
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Render Modal ở cuối component */}
      <AddRelativeModal />

      {/* Thêm phần hiển thị cảnh báo sau phần chọn người thân */}
      {showRelatives && selectedRelative && renderNutritionWarnings()}
    </div>
  )
}

export default Info

