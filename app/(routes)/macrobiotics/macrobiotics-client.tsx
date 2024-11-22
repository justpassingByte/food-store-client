'use client'

import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { useUser } from '@clerk/clerk-react'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { saveUserData } from '@/action/user-data'

type UserData = {
    age: string;
    gender: string;
    weight: string;
    height: string;
    activityLevel: string;
    diseases: string[];
    allergies: string[];
}

type FormData = UserData

type CalculatedResults = {
    calories: number;
    protein: number;
    diseases: string[];
    allergies: string[];
}

const DISEASES = [
    { id: 'diabetes', label: 'Tiểu đường' },
    { id: 'hypertension', label: 'Huyết áp cao' },
    { id: 'celiac', label: 'Bệnh Celiac' },
    { id: 'kidney', label: 'Bệnh thận' },
]

const ALLERGIES = [
    { id: 'peanut', label: 'Đậu phộng' },
    { id: 'seafood', label: 'Hải sản' },
    { id: 'dairy', label: 'Sữa' },
    { id: 'egg', label: 'Trứng' },
]

export function MacrobioticsClient({ initialData }: { initialData?: UserData[] }) {
    const { user } = useUser()
    const router = useRouter()
    
    const [formData, setFormData] = useState<FormData>({
        age: '',
        gender: '',
        weight: '',
        height: '',
        activityLevel: '',
        diseases: [],
        allergies: [],
    })
    const [calculatedResults, setCalculatedResults] = useState<CalculatedResults>(null)
    const [isSaving, setIsSaving] = useState(false)

    useEffect(() => {
        // Fetch user data when the component mounts
        const loadUserData = async () => {
            try {
                if (initialData && initialData.length > 0) { // Check if data is an array and has elements
                    const userData = initialData[0] // Access the first element
                    setFormData({
                        age: userData.age || '',
                        gender: userData.gender || '',
                        weight: userData.weight || '',
                        height: userData.height || '',
                        activityLevel: userData.activityLevel || '',
                        diseases: userData.diseases || [],
                        allergies: userData.allergies || [],
                    })
                }
            } catch (error) {
                console.error('Failed to load user data:', error)
            }
        }

        loadUserData()
    }, [])

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }
    const handleSelectChange = (name: keyof FormData) => (value: string) => {
        setFormData(prev => ({ ...prev, [name]: value === "none" ? null : value }))
    }

    const handleCheckboxChange = (type: 'diseases' | 'allergies') => (value: string) => {
        setFormData(prev => {
            const currentArray = prev[type]
            const newArray = currentArray.includes(value)
                ? currentArray.filter(item => item !== value)
                : [...currentArray, value]
            return { ...prev, [type]: newArray }
        })
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        const { age, gender, weight, height, activityLevel, diseases, allergies } = formData
        
        // Tính toán BMR
        let bmr = gender === 'male'
            ? 88.362 + (13.397 * parseFloat(weight)) + (4.799 * parseFloat(height)) - (5.677 * parseFloat(age))
            : 447.593 + (9.247 * parseFloat(weight)) + (3.098 * parseFloat(height)) - (4.330 * parseFloat(age))

        // Tính toán hệ số hoạt động
        let activityMultiplier: number
        switch (activityLevel) {
            case 'sedentary': activityMultiplier = 1.2; break
            case 'lightlyActive': activityMultiplier = 1.375; break
            case 'moderatelyActive': activityMultiplier = 1.55; break
            case 'veryActive': activityMultiplier = 1.725; break
            case 'extraActive': activityMultiplier = 1.9; break
            default: activityMultiplier = 1.2
        }

        // Tính calories và protein
        let calories = Math.round(bmr * activityMultiplier)
        let protein = Math.round(parseFloat(weight) * 0.8)

        // Điều chỉnh theo bệnh lý
        diseases.forEach(disease => {
            switch (disease) {
                case 'diabetes':
                    calories = Math.round(calories * 0.9)
                    protein = Math.round(protein * 1.2)
                    break
                case 'hypertension':
                    calories = Math.round(calories * 0.95)
                    break
                case 'celiac':
                    break
                case 'kidney':
                    protein = Math.round(protein * 0.8)
                    break
            }
        })

        if (user) {
            try {
                setIsSaving(true)
                await saveUserData(user.id, {
                    ...formData,
                    calories,
                    protein
                })
                setCalculatedResults({ calories, protein, diseases, allergies })
                console.log('User data and DRI results saved successfully')
            } catch (error) {
                console.error('Failed to save data:', error)
            } finally {
                setIsSaving(false)
            }
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center p-4 pt-14">
            <div className="absolute inset-0 overflow-hidden">
                <svg className="absolute left-[10%] top-[20%] h-56 w-56 text-purple-300 opacity-20" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 100C0 44.7715 44.7715 0 100 0C155.228 0 200 44.7715 200 100C200 155.228 155.228 200 100 200C44.7715 200 0 155.228 0 100Z" fill="currentColor" />
                </svg>
                <svg className="absolute right-[15%] bottom-[20%] h-64 w-64 text-blue-300 opacity-20" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 0L200 100L100 200L0 100L100 0Z" fill="currentColor" />
                </svg>
            </div>
            <div className="relative w-full max-w-2xl">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
                        DRI Calculator
                    </h1>
                    <p className="mt-2 text-lg text-gray-600">Calculate your Dietary Reference Intake</p>
                </div>

                <Card className="w-full shadow-xl mb-8">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">What is DRI?</CardTitle>
                    </CardHeader>
                    <CardContent className="text-gray-700">
                        <p className="mb-4">
                            The Dietary Reference Intake (DRI) is a system of nutrition recommendations that provides estimates of nutrient intakes to maintain health in healthy individuals. This calculator focuses on two key aspects:
                        </p>
                        <ul className="list-disc list-inside mb-4">
                            <li>Estimated daily calorie needs</li>
                            <li>Estimated daily protein needs</li>
                        </ul>
                        <p className="mb-4">
                            To use this calculator:
                        </p>
                        <ol className="list-decimal list-inside mb-4">
                            <li>Enter your age, gender, weight, and height</li>
                            <li>Select your activity level</li>
                            <li>If applicable, select any disease that requires a special diet</li>
                            <li>Click &quot;Calculate and Save&quot; to see your results</li>
                        </ol>
                        <p>
                            The calculator will estimate your daily calorie and protein needs based on your input, adjusting for any selected diseases. These results are then saved for future reference.
                        </p>
                        <Link href="https://ods.od.nih.gov/HealthInformation/Dietary_Reference_Intakes.aspx" target="_blank" rel="noopener noreferrer">
                            <Button variant="link" className="mt-4 text-blue-600 underline">Learn More</Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="w-full shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">Enter Your Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="age">Age</Label>
                                    <Input id="age" name="age" type="number" required value={formData.age} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <Label>Gender</Label>
                                    <RadioGroup name="gender" value={formData.gender} onValueChange={handleSelectChange('gender')} className="flex space-x-4">
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="male" id="male" />
                                            <Label htmlFor="male">Male</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <RadioGroupItem value="female" id="female" />
                                            <Label htmlFor="female">Female</Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                                <div>
                                    <Label htmlFor="weight">Weight (kg)</Label>
                                    <Input id="weight" name="weight" type="number" required value={formData.weight} onChange={handleInputChange} />
                                </div>
                                <div>
                                    <Label htmlFor="height">Height (cm)</Label>
                                    <Input id="height" name="height" type="number" required value={formData.height} onChange={handleInputChange} />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="activityLevel">Activity Level</Label>
                                <Select name="activityLevel" value={formData.activityLevel} onValueChange={handleSelectChange('activityLevel')}>
                                    <SelectTrigger id="activityLevel">
                                        <SelectValue placeholder="Select activity level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="sedentary">Sedentary</SelectItem>
                                        <SelectItem value="lightlyActive">Lightly active</SelectItem>
                                        <SelectItem value="moderatelyActive">Moderately active</SelectItem>
                                        <SelectItem value="veryActive">Very active</SelectItem>
                                        <SelectItem value="extraActive">Extra active</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <Label className="text-lg font-semibold">Bệnh lý</Label>
                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                        {DISEASES.map((disease) => (
                                            <div key={disease.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={disease.id}
                                                    checked={formData.diseases.includes(disease.id)}
                                                    onCheckedChange={(checked: boolean) => {
                                                        if (checked) {
                                                            handleCheckboxChange('diseases')(disease.id)
                                                        }
                                                    }}
                                                />
                                                <Label 
                                                    htmlFor={disease.id}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {disease.label}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <Label className="text-lg font-semibold">Dị ứng thực phẩm</Label>
                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                        {ALLERGIES.map((allergy) => (
                                            <div key={allergy.id} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={allergy.id}
                                                    checked={formData.allergies.includes(allergy.id)}
                                                    onCheckedChange={(checked: boolean) => {
                                                        if (checked) {
                                                            handleCheckboxChange('allergies')(allergy.id)
                                                        }
                                                    }}
                                                />
                                                <Label 
                                                    htmlFor={allergy.id}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {allergy.label}
                                                </Label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <Button type="submit" className="w-full" disabled={isSaving}>
                                {isSaving ? 'Saving...' : 'Calculate and Save'}
                            </Button>
                        </form>

                        {calculatedResults && (
                            <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-md shadow-inner">
                                <h2 className="text-xl font-semibold mb-2 text-gray-800">Kết quả DRI của bạn</h2>
                                <p className="text-gray-700">Calories: <span className="font-bold text-purple-600">{calculatedResults.calories} kcal</span></p>
                                <p className="text-gray-700">Protein: <span className="font-bold text-blue-600">{calculatedResults.protein} g</span></p>
                                
                                {calculatedResults.diseases.length > 0 && (
                                    <div className="mt-2">
                                        <p className="text-sm font-medium text-gray-600">Điều chỉnh cho bệnh lý:</p>
                                        <ul className="list-disc list-inside text-sm text-gray-600 ml-2">
                                            {calculatedResults.diseases.map(disease => (
                                                <li key={disease}>
                                                    {DISEASES.find(d => d.id === disease)?.label}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                
                                {calculatedResults.allergies.length > 0 && (
                                    <div className="mt-2">
                                        <p className="text-sm font-medium text-gray-600">Thực phẩm dị ứng:</p>
                                        <ul className="list-disc list-inside text-sm text-gray-600 ml-2">
                                            {calculatedResults.allergies.map(allergy => (
                                                <li key={allergy}>
                                                    {ALLERGIES.find(a => a.id === allergy)?.label}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
