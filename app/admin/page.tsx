"use client"
import React, { useEffect, useState } from 'react';
import UserAllAttendance from '@/components/UserAllAttendance';
import AllUserInfos from '@/components/AllUserInfos';
import { AttendanceData } from '@/lib/types';
import { fetchAllUser, fetchAllUser2 } from '@/lib/actions';
import toast from 'react-hot-toast';
import type { UserData } from '@/lib/types';
import { useAuth } from '@/contexts/AuthContext';
import { fetchUserEmail } from '@/lib/actions';

export default function AdminPage() {
  const [userAllDatas, setUserAllDatas] = useState<AttendanceData[]>([]);
  const [userAllDatas2, setUserAllDatas2] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true); // 初期値を true に設定
  const [isAdmin, setIsAdmin] = useState<boolean>(false); // isAdmin ステートを追加

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const data: any = await fetchAllUser();
      const data2: UserData[] = await fetchAllUser2();
      setUserAllDatas(data);
      setUserAllDatas2(data2);
      toast.success("Data has been fetched");
    } catch (error) {
      toast.error("Failed to fetch data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchDataAndCheckAdmin = async () => {
      const email = await fetchUserEmail();
      if (typeof email === 'string' && email === 'admin@mail.com') {
        setIsAdmin(true);
        console.log(isAdmin);
        fetchData(); // isAdmin が true の場合にデータをフェッチ
      } else {
        console.log("failed to fetch userdata");
      }
    };

    fetchDataAndCheckAdmin();
  }, []); // マウント時にデータを取得

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isAdmin) {
    return (
      <div>
        <div>
          <AllUserInfos data={userAllDatas2} />
        </div>
      </div>
    );
  }

  return null; // isAdmin が false の場合は何も表示しない
}
