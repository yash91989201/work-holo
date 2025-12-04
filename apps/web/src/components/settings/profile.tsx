import { Camera, Check, Loader2, Pencil, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppForm } from "@/components/ui/form/hooks";
import { Input } from "@/components/ui/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfileMutation } from "@/hooks/use-profile-mutation";
import { useSession } from "@/hooks/use-session";
import { authClient } from "@/lib/auth-client";
import {
  ProfileEmailSchema,
  ProfileImageSchema,
  ProfileNameSchema,
  ProfileUsernameFormatSchema,
  ProfileUsernameSchema,
} from "@/lib/schemas/settings/profile";
import { cn } from "@/lib/utils";
import { uploadProfileImage } from "@/utils/upload-helper";

export function Profile() {
  const session = useSession();

  if (session === null) {
    return null;
  }
  const { user } = session;

  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
      <ProfileImageSection
        imageUrl={user.image}
        userId={user.id}
        userName={user.name}
      />
      <Separator />
      <EmailSection currentEmail={user.email} />
      <Separator />
      <FullNameSection currentName={user.name} />
      <Separator />
      <DisplayUsernameSection currentDisplayUsername={user.displayUsername} />
      <Separator />
      <UsernameSection currentUsername={user.username} />
    </div>
  );
}

// ============================================================================
// Profile Image Section
// ============================================================================

interface ProfileImageSectionProps {
  userId: string;
  userName: string;
  imageUrl: string | null | undefined;
}

function ProfileImageSection({
  userId,
  userName,
  imageUrl,
}: ProfileImageSectionProps) {
  const profileMutation = useProfileMutation();
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleImageUpload = async (file: File) => {
    setIsUploadingImage(true);
    try {
      const newImageUrl = await uploadProfileImage(file, userId);
      await profileMutation.mutateAsync({ image: newImageUrl });
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setIsUploadingImage(false);
    }
  };

  const triggerFileInput = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/jpg,image/png,image/webp";
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const validation = ProfileImageSchema.safeParse({ image: file });
        if (!validation.success) {
          toast.error(validation.error.message);
          return;
        }
        await handleImageUpload(file);
      }
    };
    input.click();
  };

  const handleRemoveImage = async () => {
    await profileMutation.mutateAsync({ image: null });
  };

  return (
    <Item>
      <ItemContent>
        <ItemTitle>Profile image</ItemTitle>
        <ItemDescription>
          Update your profile picture,
          <br /> Max 5MB, jpeg, png, or webp
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={isUploadingImage}>
            <button
              className="relative cursor-pointer rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              type="button"
            >
              <Avatar className="size-9">
                <AvatarImage alt={userName} src={imageUrl || undefined} />
                <AvatarFallback>
                  {userName
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity hover:opacity-100">
                {isUploadingImage ? (
                  <Loader2 className="size-5 animate-spin text-white" />
                ) : (
                  <Camera className="size-5 text-white" />
                )}
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={triggerFileInput}>
              <Camera className="size-4" />
              Change avatar
            </DropdownMenuItem>
            {imageUrl && (
              <DropdownMenuItem
                onClick={handleRemoveImage}
                variant="destructive"
              >
                <Trash2 className="size-4" />
                Remove avatar
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </ItemActions>
    </Item>
  );
}

// ============================================================================
// Email Section
// ============================================================================

interface EmailSectionProps {
  currentEmail: string;
}

function EmailSection({ currentEmail }: EmailSectionProps) {
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);

  return (
    <Item>
      <ItemContent>
        <ItemTitle>Email</ItemTitle>
      </ItemContent>
      <ItemContent>
        <div className="flex items-center gap-2">
          <ItemDescription>{currentEmail}</ItemDescription>
          <EmailUpdateDialog
            currentEmail={currentEmail}
            isOpen={isEmailDialogOpen}
            onOpenChange={setIsEmailDialogOpen}
          />
        </div>
      </ItemContent>
    </Item>
  );
}

function EmailUpdateDialog({
  currentEmail,
  isOpen,
  onOpenChange,
}: {
  currentEmail: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const profileMutation = useProfileMutation();

  const form = useAppForm({
    defaultValues: {
      email: currentEmail,
    },
    validators: {
      onSubmit: ProfileEmailSchema,
    },
    onSubmit: async ({ value }) => {
      await profileMutation.mutateAsync({ email: value.email });
      onOpenChange(false);
    },
  });

  return (
    <Dialog onOpenChange={onOpenChange} open={isOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost">
          <Pencil className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Email Address</DialogTitle>
          <DialogDescription>
            After updating your email, you'll need to verify it before it takes
            effect.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.AppField name="email">
            {(field) => (
              <field.Input
                description="Enter your new email address"
                label="Email"
              />
            )}
          </form.AppField>
          <DialogFooter className="mt-4">
            <Button
              onClick={() => onOpenChange(false)}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
            <Button disabled={form.state.isSubmitting} type="submit">
              {form.state.isSubmitting ? "Updating..." : "Update Email"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// Full Name Section
// ============================================================================

interface FullNameSectionProps {
  currentName: string;
}

function FullNameSection({ currentName }: FullNameSectionProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const profileMutation = useProfileMutation();

  return (
    <Item>
      <ItemContent>
        <ItemTitle>Full Name</ItemTitle>
      </ItemContent>
      <ItemContent>
        {isEditingName ? (
          <InlineNameEditor
            currentName={currentName}
            onCancel={() => setIsEditingName(false)}
            onSave={(name) => {
              profileMutation.mutate({ name });
              setIsEditingName(false);
            }}
          />
        ) : (
          <div className="flex items-center gap-2">
            <ItemDescription>{currentName}</ItemDescription>
            <Button
              onClick={() => setIsEditingName(true)}
              size="sm"
              variant="ghost"
            >
              <Pencil className="size-4" />
            </Button>
          </div>
        )}
      </ItemContent>
    </Item>
  );
}

function InlineNameEditor({
  currentName,
  onSave,
  onCancel,
}: {
  currentName: string;
  onSave: (name: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(currentName);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    const validation = ProfileNameSchema.safeParse({ name: value });
    if (!validation.success) {
      setError(validation.error.message);
      return;
    }
    onSave(value);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <Input
          autoFocus
          className={cn(error && "border-destructive")}
          onChange={(e) => {
            setValue(e.target.value);
            setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") onCancel();
          }}
          value={value}
        />
        {error && <p className="mt-1 text-destructive text-xs">{error}</p>}
      </div>
      <Button onClick={handleSave} size="icon-sm" variant="ghost">
        <Check className="size-4 text-green-600" />
      </Button>
      <Button onClick={onCancel} size="icon-sm" variant="ghost">
        <X className="size-4 text-destructive" />
      </Button>
    </div>
  );
}

// ============================================================================
// Display Username Section
// ============================================================================

interface DisplayUsernameSectionProps {
  currentDisplayUsername: string | null | undefined;
}

function DisplayUsernameSection({
  currentDisplayUsername,
}: DisplayUsernameSectionProps) {
  const [isEditingDisplayUsername, setIsEditingDisplayUsername] =
    useState(false);

  const profileMutation = useProfileMutation();

  return (
    <Item>
      <ItemContent>
        <ItemTitle>Display Username</ItemTitle>
        <ItemDescription>How you want to be called in WorkHolo</ItemDescription>
      </ItemContent>
      <ItemContent>
        {isEditingDisplayUsername ? (
          <InlineDisplayUsernameEditor
            currentDisplayUsername={currentDisplayUsername || ""}
            onCancel={() => setIsEditingDisplayUsername(false)}
            onSave={(displayUsername) => {
              profileMutation.mutate({ displayUsername });
              setIsEditingDisplayUsername(false);
            }}
          />
        ) : (
          <div className="flex items-center gap-2">
            <ItemDescription>
              {currentDisplayUsername || "Not set"}
            </ItemDescription>
            <Button
              onClick={() => setIsEditingDisplayUsername(true)}
              size="sm"
              variant="ghost"
            >
              <Pencil className="size-4" />
            </Button>
          </div>
        )}
      </ItemContent>
    </Item>
  );
}

function InlineDisplayUsernameEditor({
  currentDisplayUsername,
  onSave,
  onCancel,
}: {
  currentDisplayUsername: string;
  onSave: (displayUsername: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(currentDisplayUsername);
  const [error, setError] = useState<string | null>(null);

  const handleSave = () => {
    if (!value.trim()) {
      onSave("");
      return;
    }
    onSave(value.trim());
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <Input
          autoFocus
          className={cn(error && "border-destructive")}
          onChange={(e) => {
            setValue(e.target.value);
            setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") onCancel();
          }}
          placeholder="Display username"
          value={value}
        />
        {error && <p className="mt-1 text-destructive text-xs">{error}</p>}
      </div>
      <Button onClick={handleSave} size="icon-sm" variant="ghost">
        <Check className="size-4 text-green-600" />
      </Button>
      <Button onClick={onCancel} size="icon-sm" variant="ghost">
        <X className="size-4 text-destructive" />
      </Button>
    </div>
  );
}

// ============================================================================
// Username Section
// ============================================================================

interface UsernameSectionProps {
  currentUsername: string | null | undefined;
}

function UsernameSection({ currentUsername }: UsernameSectionProps) {
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const profileMutation = useProfileMutation();

  return (
    <Item>
      <ItemContent>
        <ItemTitle>Username</ItemTitle>
        <ItemDescription>
          Nickname or firstname whatever you want to be called in WorkHolo
        </ItemDescription>
      </ItemContent>
      <ItemContent>
        {isEditingUsername ? (
          <InlineUsernameEditor
            currentUsername={currentUsername || ""}
            onCancel={() => setIsEditingUsername(false)}
            onSave={(username) => {
              profileMutation.mutate({ username });
              setIsEditingUsername(false);
            }}
          />
        ) : (
          <div className="flex items-center gap-2">
            <ItemDescription>{currentUsername || "Not set"}</ItemDescription>
            <Button
              onClick={() => setIsEditingUsername(true)}
              size="sm"
              variant="ghost"
            >
              <Pencil className="size-4" />
            </Button>
          </div>
        )}
      </ItemContent>
    </Item>
  );
}

function InlineUsernameEditor({
  currentUsername,
  onSave,
  onCancel,
}: {
  currentUsername: string;
  onSave: (username: string) => void;
  onCancel: () => void;
}) {
  const [value, setValue] = useState(currentUsername);
  const [error, setError] = useState<string | null>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);

  // Debounced availability check
  useEffect(() => {
    // Skip checking if value is empty or same as current username
    if (!value || value === currentUsername) {
      setIsCheckingAvailability(false);
      setIsAvailable(null);
      setError(null);
      return;
    }

    // Validate format first (using sync schema to avoid Promise error)
    const formatValidation = ProfileUsernameFormatSchema.safeParse(value);
    if (!formatValidation.success) {
      setIsCheckingAvailability(false);
      setIsAvailable(null);
      return;
    }

    // Debounce the availability check
    setIsCheckingAvailability(true);
    const timeoutId = setTimeout(async () => {
      try {
        const { data: response, error: checkError } =
          await authClient.isUsernameAvailable({
            username: value,
          });

        if (checkError) {
          setIsAvailable(false);
          setError("Unable to verify username availability");
        } else {
          setIsAvailable(response?.available ?? false);
          if (!response?.available) {
            setError("This username is already taken");
          }
        }
      } catch {
        setIsAvailable(false);
        setError("Unable to verify username availability");
      } finally {
        setIsCheckingAvailability(false);
      }
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      setIsCheckingAvailability(false);
    };
  }, [value, currentUsername]);

  const handleSave = async () => {
    // Don't save if checking availability
    if (isCheckingAvailability) {
      return;
    }

    setIsValidating(true);
    try {
      const validation = await ProfileUsernameSchema.safeParseAsync({
        username: value,
      });
      if (!validation.success) {
        setError(validation.error.message);
        return;
      }
      onSave(value);
    } finally {
      setIsValidating(false);
    }
  };

  // Disable save button if:
  // - Currently validating
  // - Currently checking availability
  // - Username is not available
  // - Username is same as current
  // - There's an error
  const isSaveDisabled =
    isValidating ||
    isCheckingAvailability ||
    isAvailable === false ||
    value === currentUsername ||
    !!error;

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <div className="relative">
          <Input
            autoFocus
            className={cn(
              error && isAvailable === false && "border-destructive",
              isAvailable === true && "border-green-600"
            )}
            disabled={isValidating}
            onChange={(e) => {
              setValue(e.target.value.toLowerCase());
              setError(null);
              setIsAvailable(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isSaveDisabled) handleSave();
              if (e.key === "Escape") onCancel();
            }}
            placeholder="username"
            value={value}
          />
          {isCheckingAvailability && (
            <div className="-translate-y-1/2 absolute top-1/2 right-3">
              <Loader2 className="size-4 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-destructive text-xs">{error}</p>}
        {isAvailable === true && !error && (
          <p className="mt-1 text-green-600 text-xs">Username is available</p>
        )}
      </div>
      <Button
        disabled={isSaveDisabled}
        onClick={handleSave}
        size="icon-sm"
        variant="ghost"
      >
        <Check className="size-4 text-green-600" />
      </Button>
      <Button onClick={onCancel} size="icon-sm" variant="ghost">
        <X className="size-4 text-destructive" />
      </Button>
    </div>
  );
}

// ============================================================================
// Skeleton Components
// ============================================================================

export function ProfileSkeleton() {
  return (
    <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
      <ProfileImageSectionSkeleton />
      <Separator />
      <EmailSectionSkeleton />
      <Separator />
      <FullNameSectionSkeleton />
      <Separator />
      <DisplayUsernameSectionSkeleton />
      <Separator />
      <UsernameSectionSkeleton />
    </div>
  );
}

function ProfileImageSectionSkeleton() {
  return (
    <Item>
      <ItemContent>
        <ItemTitle>Profile image</ItemTitle>
        <ItemDescription>
          Update your profile picture,
          <br /> Max 5MB, jpeg, png, or webp
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Skeleton className="size-9 rounded-full" />
      </ItemActions>
    </Item>
  );
}

function EmailSectionSkeleton() {
  return (
    <Item>
      <ItemContent>
        <ItemTitle>Email</ItemTitle>
      </ItemContent>
      <ItemContent>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="size-8" />
        </div>
      </ItemContent>
    </Item>
  );
}

function FullNameSectionSkeleton() {
  return (
    <Item>
      <ItemContent>
        <ItemTitle>Full Name</ItemTitle>
      </ItemContent>
      <ItemContent>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="size-8" />
        </div>
      </ItemContent>
    </Item>
  );
}

function DisplayUsernameSectionSkeleton() {
  return (
    <Item>
      <ItemContent>
        <ItemTitle>Display Username</ItemTitle>
        <ItemDescription>How you want to be called in WorkHolo</ItemDescription>
      </ItemContent>
      <ItemContent>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="size-8" />
        </div>
      </ItemContent>
    </Item>
  );
}

function UsernameSectionSkeleton() {
  return (
    <Item>
      <ItemContent>
        <ItemTitle>Username</ItemTitle>
        <ItemDescription>
          Nickname or firstname whatever you want to be called in WorkHolo
        </ItemDescription>
      </ItemContent>
      <ItemContent>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="size-8" />
        </div>
      </ItemContent>
    </Item>
  );
}
