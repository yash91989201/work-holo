import { EditorContent } from "@tiptap/react";
import {
	ArrowRight,
	Bold,
	Code,
	Eraser,
	Image as ImageIcon,
	Italic,
	LinkIcon,
	List,
	ListOrdered,
	Maximize,
	Mic,
	Minimize2,
	Paperclip,
	Redo,
	Send,
	SmilePlus,
	Strikethrough,
	Undo,
	X,
} from "lucide-react";
import type { KeyboardEvent } from "react";
import { useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	EmojiPicker,
	EmojiPickerContent,
	EmojiPickerFooter,
	EmojiPickerSearch,
} from "@/components/ui/emoji-picker";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Toggle } from "@/components/ui/toggle";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMessageEditor } from "@/hooks/communications/use-message-editor";
import { cn } from "@/lib/utils";
import { AutoLinkPreview } from "./auto-link-preview";
import { LinkBubbleMenu } from "./link-bubble-menu";
import { LinkPreviewNode } from "./link-preview-node";
import { createMentionSuggestion } from "./mention-suggestion";
import "tippy.js/dist/tippy.css";
import "@/styles/tiptap.css";

interface MessageEditorProps {
	content: string;
	onChange: (content: string) => void;
	onSubmit: () => void;
	disabled?: boolean;
	onCursorChange?: (position: number) => void;
	fetchUsers: (query: string) => Promise<
		Array<{
			id: string;
			name: string | null;
			image: string | null;
			email: string;
		}>
	>;
	onMaximize?: () => void;
	onMinimize?: () => void;
	isMaximized?: boolean;
	isInMaximizedComposer?: boolean;
	isRecording?: boolean;
	isCreatingMessage?: boolean;
	hasAttachments?: boolean;
	hasAudio?: boolean;
	onEmojiSelect?: (emoji: { emoji: string; label: string }) => void;
	onFileUpload?: () => void;
	onVoiceRecord?: () => void;
}

export function MessageEditor({
	content,
	onChange,
	onSubmit,
	disabled = false,
	onCursorChange,
	fetchUsers,
	onMaximize,
	onMinimize,
	isMaximized = false,
	isInMaximizedComposer = false,
	isRecording = false,
	isCreatingMessage = false,
	hasAttachments = false,
	hasAudio = false,
	onEmojiSelect,
	onFileUpload,
	onVoiceRecord,
}: MessageEditorProps) {
	const {
		editor,
		fileInputRef,
		isLinkPopoverOpen,
		setIsLinkPopoverOpen,
		linkUrl,
		setLinkUrl,
		handleImageUploadClick,
		handleFileInputChange,
		handleAddLink,
		handleSaveLink,
	} = useMessageEditor({
		content,
		onChange,
		onSubmit,
		disabled,
		onCursorChange,
		fetchUsers,
		isMaximized,
		isInMaximizedComposer,
		createMentionSuggestion,
		LinkPreviewNode,
		AutoLinkPreview,
	});

	const handleEditorKeyDown = useCallback(
		(event: KeyboardEvent<HTMLDivElement>) => {
			if (disabled) return;

			const isModifierPressed = event.ctrlKey || event.metaKey;
			const isMaximizeShortcut =
				isModifierPressed && event.key.toLowerCase() === "m";

			if (!isMaximizeShortcut) return;

			event.preventDefault();
			event.stopPropagation();

			if (!(isMaximized || isInMaximizedComposer)) {
				onMaximize?.();
				return;
			}

			if (isMaximized && isInMaximizedComposer) {
				onMinimize?.();
			}
		},
		[disabled, isInMaximizedComposer, isMaximized, onMaximize, onMinimize]
	);

	if (!editor) {
		return null;
	}

	return (
		<div
			className={cn(
				"flex min-w-0 flex-col overflow-x-hidden",
				isMaximized ? "flex-1 overflow-y-hidden" : ""
			)}
		>
			<input
				accept="image/*"
				className="hidden"
				multiple
				onChange={handleFileInputChange}
				ref={fileInputRef}
				type="file"
			/>

			<div
				className={cn(
					"mx-3 overflow-hidden rounded-lg border transition-colors",
					"focus-within:border-primary",
					isMaximized && "mx-0 flex flex-1 flex-col rounded-none border-0"
				)}
			>
				{/* Editor Content */}
				<div
					className={cn(
						"relative min-w-0 overflow-x-hidden",
						isMaximized && "flex-1 overflow-y-auto"
					)}
				>
					<LinkBubbleMenu editor={editor} />
					<div className="p-3">
						<EditorContent
							className={cn("min-w-0", disabled && "opacity-50")}
							editor={editor}
							onKeyDown={handleEditorKeyDown}
						/>
					</div>

					{/* Content Length Badge - Bottom Right */}
					<div className="pointer-events-none absolute right-4 bottom-3">
						<Badge
							variant={content.length > 5000 ? "destructive" : "secondary"}
						>
							{content.length}/5000
						</Badge>
					</div>
				</div>

				{/* Actions Bar at Bottom */}
				<div className="flex shrink-0 flex-wrap items-center gap-2 border-t bg-muted/30 px-3 py-1.5">
					{/* Formatting Group */}
					<div className="flex items-center gap-0.5">
						<Toggle
							aria-label="Toggle bold"
							onPressedChange={() => editor.chain().focus().toggleBold().run()}
							pressed={editor.isActive("bold")}
							size="sm"
							title="Bold (Ctrl+B)"
						>
							<Bold />
						</Toggle>

						<Toggle
							aria-label="Toggle italic"
							onPressedChange={() =>
								editor.chain().focus().toggleItalic().run()
							}
							pressed={editor.isActive("italic")}
							size="sm"
							title="Italic (Ctrl+I)"
						>
							<Italic />
						</Toggle>

						<Toggle
							aria-label="Toggle strikethrough"
							onPressedChange={() =>
								editor.chain().focus().toggleStrike().run()
							}
							pressed={editor.isActive("strike")}
							size="sm"
							title="Strikethrough (Ctrl+Shift+S)"
						>
							<Strikethrough />
						</Toggle>

						<Toggle
							aria-label="Toggle code"
							onPressedChange={() => editor.chain().focus().toggleCode().run()}
							pressed={editor.isActive("code")}
							size="sm"
							title="Inline Code (Ctrl+E)"
						>
							<Code />
						</Toggle>
					</div>

					<Separator className="h-4" orientation="vertical" />

					{/* Lists Group */}
					<div className="flex items-center gap-0.5">
						<Toggle
							aria-label="Toggle bullet list"
							onPressedChange={() =>
								editor.chain().focus().toggleBulletList().run()
							}
							pressed={editor.isActive("bulletList")}
							size="sm"
							title="Bullet List (Ctrl+Shift+8)"
						>
							<List />
						</Toggle>

						<Toggle
							aria-label="Toggle ordered list"
							onPressedChange={() =>
								editor.chain().focus().toggleOrderedList().run()
							}
							pressed={editor.isActive("orderedList")}
							size="sm"
							title="Ordered List (Ctrl+Shift+7)"
						>
							<ListOrdered />
						</Toggle>
					</div>

					<Separator className="h-4" orientation="vertical" />

					{/* History Group */}
					<div className="flex items-center gap-0.5">
						<Toggle
							aria-label="Undo"
							disabled={!editor.can().undo()}
							onPressedChange={() => editor.chain().focus().undo().run()}
							pressed={false}
							size="sm"
							title="Undo (Ctrl+Z)"
						>
							<Undo />
						</Toggle>

						<Toggle
							aria-label="Redo"
							disabled={!editor.can().redo()}
							onPressedChange={() => editor.chain().focus().redo().run()}
							pressed={false}
							size="sm"
							title="Redo (Ctrl+Y)"
						>
							<Redo />
						</Toggle>
						<Toggle
							aria-label="Clear content"
							onClick={() => {
								editor.chain().focus().clearContent(true).run();
								onChange("");
							}}
							pressed={false}
							size="sm"
							title="Clear Content"
						>
							<Eraser />
						</Toggle>
					</div>

					<Separator className="h-4" orientation="vertical" />

					{/* Insert Group */}
					<div className="flex items-center gap-0.5">
						<Popover
							onOpenChange={setIsLinkPopoverOpen}
							open={isLinkPopoverOpen}
						>
							<PopoverTrigger
								render={
									<Toggle
										aria-label="Add a link"
										onPressedChange={handleAddLink}
										pressed={editor.isActive("link") || isLinkPopoverOpen}
										size="sm"
										title="Insert Link (Ctrl+K)"
									>
										<LinkIcon />
									</Toggle>
								}
							/>
							<PopoverContent align="start" className="w-80 p-2">
								<InputGroup>
									<InputGroupInput
										autoFocus
										onChange={(e) => setLinkUrl(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												handleSaveLink();
											}
											if (e.key === "Escape") {
												setLinkUrl("");
												setIsLinkPopoverOpen(false);
											}
										}}
										placeholder="https://example.com"
										type="url"
										value={linkUrl}
									/>
									<InputGroupAddon align="inline-end">
										<InputGroupButton
											onClick={() => {
												setLinkUrl("");
												setIsLinkPopoverOpen(false);
											}}
											size="icon-xs"
											title="Cancel"
											type="button"
											variant="ghost"
										>
											<X />
										</InputGroupButton>
										<InputGroupButton
											onClick={handleSaveLink}
											size="icon-xs"
											title="Insert Link"
											type="button"
											variant="ghost"
										>
											<ArrowRight />
										</InputGroupButton>
									</InputGroupAddon>
								</InputGroup>
							</PopoverContent>
						</Popover>

						<Toggle
							aria-label="Upload image"
							onPressedChange={handleImageUploadClick}
							pressed={false}
							size="sm"
							title="Upload Image"
						>
							<ImageIcon />
						</Toggle>
					</div>

					<Separator className="h-4" orientation="vertical" />

					{/* Communication Actions Group */}
					<div className="flex items-center gap-0.5">
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger
									render={
										<Button
											aria-label={
												isRecording ? "Stop recording" : "Start voice message"
											}
											className={cn(
												"transition-all duration-200",
												isRecording && "relative"
											)}
											disabled={!onVoiceRecord || content.trim().length > 0}
											onClick={onVoiceRecord}
											size="icon-sm"
											title={
												content.trim().length > 0
													? "Clear text to record audio"
													: isRecording
														? "Stop recording"
														: "Start voice message"
											}
											variant="ghost"
										>
											<Mic
												className={cn(
													content.trim().length > 0 && "opacity-50",
													isRecording && "text-red-500"
												)}
											/>
										</Button>
									}
								/>
								{content.trim().length > 0 && (
									<TooltipContent>
										<p>Clear text to record audio</p>
									</TooltipContent>
								)}
							</Tooltip>
						</TooltipProvider>

						<Popover>
							<PopoverTrigger
								render={
									<Button
										className="transition-all duration-200"
										disabled={!onEmojiSelect || hasAudio}
										size="icon-sm"
										title="Add emoji"
										variant="ghost"
									>
										<SmilePlus className={cn(hasAudio && "opacity-50")} />
									</Button>
								}
							/>
							<PopoverContent align="start" className="w-80 p-0" side="top">
								<EmojiPicker onEmojiSelect={onEmojiSelect || (() => {})}>
									<EmojiPickerSearch
										className="h-16"
										placeholder="Search emoji..."
									/>
									<EmojiPickerContent />
									<EmojiPickerFooter />
								</EmojiPicker>
							</PopoverContent>
						</Popover>

						<Button
							className="transition-all duration-200"
							onClick={onFileUpload}
							size="icon-sm"
							title="Attach file"
							variant="ghost"
						>
							<Paperclip className="h-3.5 w-3.5" />
						</Button>
					</div>

					<Separator className="h-4" orientation="vertical" />

					{/* Actions Group - Right Aligned */}
					<div className="ml-auto flex items-center gap-3">
						<Toggle
							aria-label={isMaximized ? "Minimize editor" : "Maximize editor"}
							onPressedChange={() => {
								if (isMaximized) {
									onMinimize?.();
								} else {
									onMaximize?.();
								}
							}}
							pressed={isMaximized}
							size="sm"
							title={
								isMaximized
									? "Minimize Editor (Ctrl+M)"
									: "Maximize Editor (Ctrl+M)"
							}
						>
							{isMaximized ? (
								<Minimize2 className="h-3.5 w-3.5" />
							) : (
								<Maximize className="h-3.5 w-3.5" />
							)}
						</Toggle>

						<Button
							className={cn(
								"ml-2 rounded-full transition-all duration-200",
								(content.trim().length > 0 || hasAttachments || hasAudio) &&
									"scale-105 bg-primary hover:bg-primary/90"
							)}
							disabled={
								isCreatingMessage ||
								content.length > 5000 ||
								!(content.trim().length > 0 || hasAttachments || hasAudio)
							}
							onClick={onSubmit}
							size="icon-sm"
							title="Send message (Enter)"
							variant={
								content.trim().length > 0 || hasAttachments || hasAudio
									? "default"
									: "ghost"
							}
						>
							{isCreatingMessage ? (
								<Spinner />
							) : (
								<Send className="h-3.5 w-3.5" />
							)}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
