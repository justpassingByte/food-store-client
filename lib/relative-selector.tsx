import { useUser } from "@clerk/nextjs";

import { useState } from "react";

interface RelativeSelectorProps {
  onSelect: (relativeId: string) => void;
}

const findUserByEmail = async (email: string) => {
  const response = await fetch(`/api/users/search?email=${encodeURIComponent(email)}`);
  const data = await response.json();
  return data.users;
};

const RelativeSelector = ({ onSelect }: RelativeSelectorProps) => {
  const { user } = useUser();
  const [email, setEmail] = useState("");
  const [relatives, setRelatives] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const searchRelative = async () => {
    if (!email) return;
    
    setLoading(true);
    try {
      const users = await findUserByEmail(email);
      console.log('users:', users);
      setRelatives(users.filter((u: { id: string | undefined; }) => u.id !== user?.id));
    } catch (error) {
      console.error("Lỗi tìm kiếm:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="email"
          placeholder="Email người thân..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <button 
          onClick={searchRelative}
          disabled={loading}
          className="bg-primary text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Đang tìm..." : "Tìm kiếm"}
        </button>
      </div>
      
      <div className="space-y-2">
        {relatives.map((relative) => (
          <div 
            key={relative.id}
            onClick={() => onSelect(relative.id)}
            className="border p-3 rounded cursor-pointer hover:bg-gray-50"
          >
            <p>{relative.firstName} {relative.lastName}</p>
            <p className="text-sm text-gray-500">{relative.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export { RelativeSelector };
