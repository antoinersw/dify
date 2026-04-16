'use client'
import type { AppData } from '@/models/share'
import {
  useEffect,
  useMemo,
} from 'react'
import ChatWrapper from '@/app/components/base/chat/embedded-chatbot/chat-wrapper'
import Header from '@/app/components/base/chat/embedded-chatbot/header'
import Loading from '@/app/components/base/loading'
import LogoHeader from '@/app/components/base/logo/logo-embedded-chat-header'
import useBreakpoints, { MediaType } from '@/hooks/use-breakpoints'
import useDocumentTitle from '@/hooks/use-document-title'
import { AppSourceType } from '@/service/share'
import { cn } from '@/utils/classnames'
import {
  EmbeddedChatbotContext,
  useEmbeddedChatbotContext,
} from './context'
import { useEmbeddedChatbot } from './hooks'
import { useThemeContext } from './theme/theme-context'
import { CssTransform } from './theme/utils'
import { isDify } from './utils'

const Chatbot = () => {
  const {
    isMobile,
    allowResetChat,
    appData,
    appChatListDataLoading,
    chatShouldReloadKey,
    handleNewConversation,
    themeBuilder,
  } = useEmbeddedChatbotContext()

  const customConfig = appData?.custom_config
  const site = appData?.site

  const difyIcon = <LogoHeader />

  useEffect(() => {
    themeBuilder?.buildTheme(site?.chat_color_theme, site?.chat_color_theme_inverted)
  }, [site, customConfig, themeBuilder])

  useDocumentTitle(site?.title || 'Chat')

  const headerShellStyle = useMemo(
    () => Object.assign(
      {},
      CssTransform(themeBuilder?.theme?.backgroundHeaderColorStyle ?? ''),
    ),
    [themeBuilder?.theme?.backgroundHeaderColorStyle],
  )

  return (
    <div className="relative flex h-[100dvh] min-h-0 flex-col">
      <div
        className={cn(
          'flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl',
          isMobile && 'shadow-xs',
        )}
        style={headerShellStyle}
      >
        <Header
          isMobile={isMobile}
          allowResetChat={allowResetChat}
          title={site?.title || ''}
          customerIcon={isDify() ? difyIcon : ''}
          theme={themeBuilder?.theme}
          onCreateNewChat={handleNewConversation}
        />
        <div
          className={cn(
            'flex min-h-0 flex-1 flex-col overflow-y-auto bg-chatbot-bg',
            isMobile ? 'm-[0.5px] rounded-2xl' : 'rounded-b-2xl',
          )}
        >
          {appChatListDataLoading && (
            <Loading type="app" />
          )}
          {!appChatListDataLoading && (
            <ChatWrapper key={chatShouldReloadKey} />
          )}
        </div>
      </div>
      {/* <div
        className="flex h-[60px] shrink-0 items-center justify-center rounded-2xl"
        style={headerShellStyle}
      >
        {isDify() && (
          <LogoHeader className="!h-10 w-auto" />
        )}
      </div> */}
    </div>
  )
}

const EmbeddedChatbotWrapper = () => {
  const media = useBreakpoints()
  const isMobile = media === MediaType.mobile
  const themeBuilder = useThemeContext()

  const {
    appData,
    appParams,
    appMeta,
    appChatListDataLoading,
    currentConversationId,
    currentConversationItem,
    appPrevChatList,
    pinnedConversationList,
    conversationList,
    newConversationInputs,
    newConversationInputsRef,
    handleNewConversationInputsChange,
    inputsForms,
    handleNewConversation,
    handleStartChat,
    handleChangeConversation,
    handleNewConversationCompleted,
    chatShouldReloadKey,
    isInstalledApp,
    allowResetChat,
    appId,
    handleFeedback,
    currentChatInstanceRef,
    clearChatList,
    setClearChatList,
    isResponding,
    setIsResponding,
    currentConversationInputs,
    setCurrentConversationInputs,
    allInputsHidden,
    initUserVariables,
  } = useEmbeddedChatbot(AppSourceType.webApp)

  return (
    // eslint-disable-next-line react/no-context-provider -- use-context-selector requires Provider
    <EmbeddedChatbotContext.Provider value={{
      appSourceType: AppSourceType.webApp,
      appData: (appData as AppData) || null,
      appParams,
      appMeta,
      appChatListDataLoading,
      currentConversationId,
      currentConversationItem,
      appPrevChatList,
      pinnedConversationList,
      conversationList,
      newConversationInputs,
      newConversationInputsRef,
      handleNewConversationInputsChange,
      inputsForms,
      handleNewConversation,
      handleStartChat,
      handleChangeConversation,
      handleNewConversationCompleted,
      chatShouldReloadKey,
      isMobile,
      isInstalledApp,
      allowResetChat,
      appId,
      handleFeedback,
      currentChatInstanceRef,
      themeBuilder,
      clearChatList,
      setClearChatList,
      isResponding,
      setIsResponding,
      currentConversationInputs,
      setCurrentConversationInputs,
      allInputsHidden,
      initUserVariables,
    }}
    >
      <Chatbot />
    </EmbeddedChatbotContext.Provider>
  )
}

const EmbeddedChatbot = () => {
  return <EmbeddedChatbotWrapper />
}

export default EmbeddedChatbot
