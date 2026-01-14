import { zodResolver } from "@hookform/resolvers/zod";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	type PaginationState,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";
import { useDebounce } from "@uidotdev/usehooks";
import type { MemberWithUserType } from "@work-holo/api/lib/types";
import {
	ArrowUpDown,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	Crown,
	LayoutList,
	MoreHorizontal,
	Search,
	Shield,
	User,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useAuthedSession } from "@/hooks/use-authed-session";
import { authClient } from "@/lib/auth-client";
import { UpdateMemberRoleSchema } from "@/lib/schemas/admin/member";
import type { UpdateMemberRoleFormType } from "@/lib/types";
import { queryClient, queryUtils } from "@/utils/orpc";

const getRoleBadgeVariant = (role: string) => {
	switch (role) {
		case "owner":
			return "default";
		case "admin":
			return "secondary";
		case "member":
			return "outline";
		default:
			return "outline";
	}
};

const getRoleIcon = (role: string) => {
	switch (role) {
		case "owner":
			return Crown;
		case "admin":
			return Shield;
		case "member":
			return User;
		default:
			return User;
	}
};

function UpdateMemberRole({
	member,
	open,
	onOpenChange,
}: {
	member: MemberWithUserType;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const form = useForm<UpdateMemberRoleFormType>({
		resolver: zodResolver(UpdateMemberRoleSchema),
		defaultValues: {
			role: member.role as "admin" | "member",
		},
	});

	const isLoading = form.formState.isSubmitting;

	const onSubmit = async (data: UpdateMemberRoleFormType) => {
		try {
			// Use better-auth organization client to update member role
			await authClient.organization.updateMemberRole({
				memberId: member.id,
				role: data.role,
			});

			// Invalidate and refetch the member list
			queryClient.invalidateQueries({
				queryKey: queryUtils.admin.member.listMembers.queryKey(),
			});

			toast.success(`Member role updated to ${data.role}`);
			onOpenChange(false);
		} catch (error) {
			console.error("Failed to update member role:", error);
			toast.error("Failed to update member role");
		}
	};

	return (
		<Dialog onOpenChange={onOpenChange} open={open}>
			<DialogContent className="sm:max-w-105">
				<DialogHeader>
					<DialogTitle>Update member role</DialogTitle>
					<DialogDescription>
						Change the role for {member.user.name}
					</DialogDescription>
				</DialogHeader>

				<Form {...form}>
					<form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
						<FormField
							control={form.control}
							name="role"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Role</FormLabel>
									<Select
										defaultValue={field.value}
										onValueChange={field.onChange}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue>Select a role</SelectValue>
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="admin">
												<div className="flex items-center gap-2">
													<Shield className="h-4 w-4" />
													Admin
												</div>
											</SelectItem>
											<SelectItem value="member">
												<div className="flex items-center gap-2">
													<User className="h-4 w-4" />
													Member
												</div>
											</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<DialogFooter>
							<Button
								disabled={isLoading}
								onClick={() => onOpenChange(false)}
								type="button"
								variant="outline"
							>
								Cancel
							</Button>
							<Button disabled={isLoading} type="submit">
								{isLoading ? "Updating..." : "Update Role"}
							</Button>
						</DialogFooter>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}

function RemoveMember({
	member,
	open,
	onOpenChange,
}: {
	member: MemberWithUserType;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const [isRemoving, setIsRemoving] = useState(false);

	const handleRemove = async () => {
		setIsRemoving(true);
		try {
			await authClient.organization.removeMember({
				memberIdOrEmail: member.id,
			});

			// Invalidate and refetch the member list
			queryClient.invalidateQueries({
				queryKey: queryUtils.admin.member.listMembers.queryKey(),
			});

			toast.success(
				`${member.user.name} has been removed from the organization`
			);
			onOpenChange(false);
		} catch (error) {
			console.error("Failed to remove member:", error);
			toast.error("Failed to remove member");
		} finally {
			setIsRemoving(false);
		}
	};

	return (
		<AlertDialog onOpenChange={onOpenChange} open={open}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Remove member</AlertDialogTitle>
					<AlertDialogDescription>
						Are you sure you want to remove {member.user.name} from the
						organization? This action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={isRemoving}>Cancel</AlertDialogCancel>
					<AlertDialogAction
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						disabled={isRemoving}
						onClick={(e) => {
							e.preventDefault();
							handleRemove();
						}}
					>
						{isRemoving ? "Removing..." : "Remove"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export const MemberListTable = () => {
	const { user } = useAuthedSession();

	// State
	const [sorting, setSorting] = useState<SortingState>([]);
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});
	const [searchTerm, setSearchTerm] = useState("");
	const debouncedSearch = useDebounce(searchTerm, 500);

	const [updateRoleMember, setUpdateRoleMember] =
		useState<MemberWithUserType | null>(null);

	const [isUpdateRoleOpen, setIsUpdateRoleOpen] = useState(false);

	const [removeMember, setRemoveMember] = useState<MemberWithUserType | null>(
		null
	);

	const [isRemoveMemberOpen, setIsRemoveMemberOpen] = useState(false);

	// Data Fetching
	const {
		data: { members, total, pageCount },
	} = useSuspenseQuery(
		queryUtils.admin.member.listMembers.queryOptions({
			input: {
				page: pagination.pageIndex + 1,
				perPage: pagination.pageSize,
				search: debouncedSearch || undefined,
				sorting: sorting.map((s) => ({
					id: s.id,
					desc: s.desc,
				})),
			},
		})
	);

	const columns = useMemo<ColumnDef<MemberWithUserType>[]>(
		() => [
			{
				accessorKey: "user.name",
				id: "user.name",
				header: ({ column }) => (
					<Button
						className="-ml-4 h-8"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						variant="ghost"
					>
						Member
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				),
				cell: ({ row }) => {
					const member = row.original;

					return (
						<div className="flex items-center gap-3">
							<Avatar>
								<AvatarImage src={member.user.image ?? undefined} />
								<AvatarFallback>
									{member.user.name
										?.split(" ")
										.map((n) => n[0])
										.join("")
										.toUpperCase() || "U"}
								</AvatarFallback>
							</Avatar>
							<div>
								<div className="font-medium">
									{member.user.name ?? "Unknown"}
								</div>
								<div className="text-muted-foreground text-sm">
									{member.user.email}
								</div>
								{member.userId === user.id && (
									<Badge className="mt-1 text-xs" variant="outline">
										You
									</Badge>
								)}
							</div>
						</div>
					);
				},
			},
			{
				accessorKey: "role",
				header: ({ column }) => (
					<Button
						className="-ml-4 h-8"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						variant="ghost"
					>
						Role
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				),
				cell: ({ row }) => {
					const member = row.original;
					const RoleIcon = getRoleIcon(member.role);
					return (
						<Badge className="gap-1" variant={getRoleBadgeVariant(member.role)}>
							<RoleIcon className="h-3 w-3" />
							{member.role}
						</Badge>
					);
				},
			},
			{
				accessorKey: "createdAt",
				header: ({ column }) => (
					<Button
						className="-ml-4 h-8"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						variant="ghost"
					>
						Joined
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				),
				cell: ({ row }) => (
					<div className="text-muted-foreground">
						{new Date(row.original.user.createdAt).toLocaleDateString()}
					</div>
				),
			},
			{
				id: "actions",
				header: () => <div className="text-right">Actions</div>,
				cell: ({ row }) => {
					const member = row.original;

					// Don't show actions for the current user or owners
					if (member.userId === user.id || member.role === "owner") {
						return <div className="text-right text-muted-foreground">-</div>;
					}

					return (
						<div className="text-right">
							<DropdownMenu>
								<DropdownMenuTrigger
									render={
										<Button className="h-8 w-8 p-0" variant="ghost">
											<span className="sr-only">Open menu</span>
											<MoreHorizontal className="h-4 w-4" />
										</Button>
									}
								/>
								<DropdownMenuContent align="end">
									<DropdownMenuItem
										onClick={() => {
											setUpdateRoleMember(member);
											setIsUpdateRoleOpen(true);
										}}
									>
										Update role
									</DropdownMenuItem>
									<DropdownMenuItem
										className="text-destructive focus:text-destructive"
										onClick={() => {
											setRemoveMember(member);
											setIsRemoveMemberOpen(true);
										}}
									>
										Remove member
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					);
				},
			},
		],
		[user.id]
	);

	const table = useReactTable({
		data: members,
		columns,
		state: {
			sorting,
			pagination,
		},
		pageCount,
		rowCount: total,
		onSortingChange: setSorting,
		onPaginationChange: setPagination,
		getCoreRowModel: getCoreRowModel(),
		manualPagination: true,
		manualSorting: true,
		manualFiltering: true,
	});

	return (
		<div className="w-full rounded-md border bg-card text-card-foreground shadow-sm">
			{/* Header */}
			<div className="flex items-center justify-between gap-4 border-b p-4">
				<div className="flex flex-1 items-center gap-2">
					<InputGroup className="w-full max-w-sm">
						<InputGroupAddon>
							<Search className="size-4" />
						</InputGroupAddon>
						<InputGroupInput
							onChange={(event) => setSearchTerm(event.target.value)}
							placeholder="Search members..."
							value={searchTerm}
						/>
					</InputGroup>
				</div>
			</div>

			{/* Table */}
			<div className="rounded-md border-b">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow className="hover:bg-transparent" key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									className="hover:bg-muted/50"
									data-state={row.getIsSelected() && "selected"}
									key={row.id}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									className="h-24 text-center"
									colSpan={columns.length}
								>
									<div className="flex flex-col items-center gap-2">
										<LayoutList className="h-8 w-8 text-muted-foreground" />
										<p className="text-muted-foreground">No members found</p>
									</div>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			<div className="flex items-center justify-between p-4">
				<div className="flex items-center gap-2 text-muted-foreground text-sm">
					<div className="flex items-center gap-2">
						<p className="hidden sm:block">Rows per page</p>
						<Select
							onValueChange={(value) => {
								table.setPageSize(Number(value));
							}}
							value={`${table.getState().pagination.pageSize}`}
						>
							<SelectTrigger className="h-8 w-16">
								<SelectValue>
									{table.getState().pagination.pageSize}
								</SelectValue>
							</SelectTrigger>
							<SelectContent side="top">
								{[10, 20, 30, 40, 50].map((pageSize) => (
									<SelectItem key={pageSize} value={`${pageSize}`}>
										{pageSize}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div>{total} row(s) total</div>
				</div>
				<div className="flex items-center space-x-2">
					{/* Pagination Buttons - reused logic */}
					<Button
						className="h-8 px-2 lg:px-3"
						disabled={!table.getCanPreviousPage()}
						onClick={() => table.setPageIndex(0)}
						variant="outline"
					>
						<span className="sr-only">Go to first page</span>
						<ChevronsLeft />
					</Button>
					<Button
						className="h-8 px-2 lg:px-3"
						disabled={!table.getCanPreviousPage()}
						onClick={() => table.previousPage()}
						variant="outline"
					>
						<span className="sr-only">Go to previous page</span>
						<ChevronLeft />
					</Button>
					<div className="flex items-center justify-center font-medium text-sm">
						{table.getState().pagination.pageIndex + 1} /{" "}
						{table.getPageCount() || 1}
					</div>
					<Button
						className="h-8 px-2 lg:px-3"
						disabled={!table.getCanNextPage()}
						onClick={() => table.nextPage()}
						variant="outline"
					>
						<span className="sr-only">Go to next page</span>
						<ChevronRight />
					</Button>
					<Button
						className="h-8 px-2 lg:px-3"
						disabled={!table.getCanNextPage()}
						onClick={() => table.setPageIndex(table.getPageCount() - 1)}
						variant="outline"
					>
						<span className="sr-only">Go to last page</span>
						<ChevronsRight />
					</Button>
				</div>
			</div>

			{updateRoleMember && (
				<UpdateMemberRole
					member={updateRoleMember}
					onOpenChange={(open) => {
						setIsUpdateRoleOpen(open);
						if (!open) {
							setUpdateRoleMember(null);
						}
					}}
					open={isUpdateRoleOpen}
				/>
			)}

			{removeMember && (
				<RemoveMember
					member={removeMember}
					onOpenChange={(open) => {
						setIsRemoveMemberOpen(open);
						if (!open) {
							setRemoveMember(null);
						}
					}}
					open={isRemoveMemberOpen}
				/>
			)}
		</div>
	);
};

export const MemberListTableSkeleton = () => (
	<div className="w-full rounded-md border bg-card text-card-foreground shadow-sm">
		<div className="flex items-center justify-between gap-4 border-b p-4">
			<div className="space-y-2">
				<Skeleton className="h-9 w-64" />
			</div>
		</div>
		<div className="rounded-md border-b">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Member</TableHead>
						<TableHead>Role</TableHead>
						<TableHead>Joined</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{Array.from({ length: 5 }).map((_, index) => (
						<TableRow key={index.toString()}>
							<TableCell>
								<div className="flex items-center gap-3">
									<Skeleton className="h-10 w-10 rounded-full" />
									<div className="space-y-2">
										<Skeleton className="h-4 w-32" />
										<Skeleton className="h-3 w-48" />
									</div>
								</div>
							</TableCell>
							<TableCell>
								<Skeleton className="h-6 w-20" />
							</TableCell>
							<TableCell>
								<Skeleton className="h-4 w-24" />
							</TableCell>
							<TableCell className="text-right">
								<Skeleton className="ml-auto h-8 w-8" />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	</div>
);
