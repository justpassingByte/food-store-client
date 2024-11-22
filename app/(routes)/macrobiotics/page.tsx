import { currentUser } from '@clerk/nextjs/server'
import { MacrobioticsClient } from './macrobiotics-client'
import { fetchUserData } from '@/action/user-data'

export default async function MacrobioticsPage() {
    const user = await currentUser()
    
    if (user?.id) {
        const data = await fetchUserData(user.id)
        return <MacrobioticsClient initialData={data} />
    }
    
    return <MacrobioticsClient />
}
