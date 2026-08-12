'use client'

import MessageCard from '@/components/MessageCard';
import { Loader2, RefreshCcw, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner'
import { Message } from '@/model/User'
import { acceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useSession } from 'next-auth/react'
import React, { useCallback, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

const Page = () => {
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [isSwitchLoading, setIsSwitchLoading] = useState(false)
    const [copied, setCopied] = useState(false)

    const handleDeleteMessage = (messageId: string) => {
        setMessages(messages.filter((msg) => msg._id?.toString() !== messageId))
    }

    const { data: session } = useSession()

    const form = useForm({
        resolver: zodResolver(acceptMessageSchema)
    })

    const { register, watch, setValue } = form

    const acceptMessage = watch('acceptMessage')

    const fetchAcceptMessage = useCallback(async () => {
        setIsSwitchLoading(true)

        try {
            const response = await axios.get<ApiResponse>('/api/accept-messages')
            setValue('acceptMessage', response.data.isAcceptingMessages ?? false)
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            toast.error(axiosError.response?.data.message || "Failed to fetch message settings")
        } finally {
            setIsSwitchLoading(false)
        }
    }, [setValue])

    const fetchMessages = useCallback(
        async (refresh: boolean = false) => {
            setIsLoading(true);
            try {
                const response = await axios.get<ApiResponse>('/api/get-messages');
                setMessages(response.data.messages || []);
                if (refresh) {
                    toast.success('Refreshed messages', {
                        description: 'Showing latest messages',
                    });
                }
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                toast.error(axiosError.response?.data.message ?? 'Failed to fetch messages');
            } finally {
                setIsLoading(false);
            }
        },
        [setMessages]
    );

    useEffect(() => {
        if (!session || !session.user) return;

        fetchMessages();
        fetchAcceptMessage();
    }, [session, fetchAcceptMessage, fetchMessages]);

    const handleSwitchChange = async () => {
        try {
            const response = await axios.post<ApiResponse>('/api/accept-messages', {
                acceptMessages: !acceptMessage,
            });
            setValue('acceptMessage', !acceptMessage);
            toast.success(response.data.message);
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            toast.error(axiosError.response?.data.message ?? 'Failed to update message settings');
        }
    };

    if (!session || !session.user) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    const { username } = session.user;

    const baseUrl = typeof window !== 'undefined'
        ? `${window.location.protocol}//${window.location.host}`
        : '';
    const profileUrl = `${baseUrl}/u/${username}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(profileUrl);
        setCopied(true);
        toast.success('URL copied!', {
            description: 'Profile URL has been copied to clipboard.',
        });
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-card border rounded-xl w-full max-w-6xl shadow-sm">
            <h1 className="text-3xl font-bold tracking-tight mb-6">Dashboard</h1>

            <div className="mb-6">
                <h2 className="text-sm font-medium text-muted-foreground mb-2">
                    Your unique link
                </h2>
                <div className="flex items-center gap-2">
                    <Input
                        type="text"
                        value={profileUrl}
                        readOnly
                        className="flex-1 bg-muted/50 font-mono text-sm"
                    />
                    <Button onClick={copyToClipboard} variant="outline" size="icon">
                        {copied ? (
                            <Check className="h-4 w-4 text-green-600" />
                        ) : (
                            <Copy className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-3 mb-6">
                <Switch
                    {...register('acceptMessage')}
                    checked={!! acceptMessage}
                    onCheckedChange={handleSwitchChange}
                    disabled={isSwitchLoading}
                />
                <span className="text-sm font-medium">
                    Accepting messages:{' '}
                    <span className={acceptMessage ? 'text-green-600' : 'text-muted-foreground'}>
                        {acceptMessage ? 'On' : 'Off'}
                    </span>
                </span>
            </div>

            <Separator className="mb-6" />

            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Messages</h2>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                        e.preventDefault();
                        fetchMessages(true);
                    }}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                        <RefreshCcw className="h-4 w-4 mr-2" />
                    )}
                    Refresh
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {messages.length > 0 ? (
                    messages.map((message) => (
                        <MessageCard
                            key={message._id?.toString()}
                            message={message}
                            onMessageDelete={handleDeleteMessage}
                        />
                    ))
                ) : (
                    <p className="text-muted-foreground text-sm col-span-full text-center py-12">
                        No messages to display yet.
                    </p>
                )}
            </div>
        </div>
    );
}

export default Page