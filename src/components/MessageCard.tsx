'use client'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from './ui/button';
import axios , {AxiosError} from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "@/components/ui/toast";
import { X } from 'lucide-react';
import { Message } from '@/model/User';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import React from 'react'
type MessageCardProps = {
    message : Message,
    onMessageDelete : (messageId: string)=> void
}

const MessageCard = ({message, onMessageDelete}: MessageCardProps) => {

    const handleDeleteConfirm = async () => {
      try {
          const response = await axios.delete<ApiResponse>(
              `/api/delete-message/${message._id}`
            );
           toast.add({
             title: response.data.message,
            });
           onMessageDelete(message._id.toString());

        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
             toast.add({
                title: 'Error',
                description: axiosError.response?.data.message ?? 'Failed to delete message',
                type: 'destructive',
            });
        } 
    };
    

  return (
        <Card>
         <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <AlertDialog>
                <AlertDialogTrigger render={<Button variant="destructive" />}>
                    Show Dialog
                    </AlertDialogTrigger> 
                      <Button variant='destructive'>
                          <X className="w-5 h-5" />
                      </Button>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        from our servers.
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteConfirm}>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialog>
            <CardDescription>Card Description</CardDescription>
            <CardAction>Card Action</CardAction>
         </CardHeader>
         <CardContent>

         </CardContent>
         
        </Card>
  )
}

export default MessageCard
