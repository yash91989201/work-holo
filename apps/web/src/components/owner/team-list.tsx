import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	type PaginationState,
	type SortingState,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table";
import { useDebounce } from "@uidotdev/usehooks";
import type { TeamMemberType } from "@work-holo/db/lib/types";
import { format } from "date-fns";
import {
	ArrowUpDown,
	Building2,
	Calendar as CalendarIcon,
	MoreHorizontal,
	Search,
	Trash2,
	Users,
} from "lucide-react";
import * as React from "react";
import { Suspense } from "react";
import type { DateRange } from "react-day-picker";
import { CreateTeamForm } from "@/components/admin/team/create-team-form";
import {
	AddTeamMemberDialog,
	RemoveTeamMemberDialog,
} from "@/components/owner/team-member-dialogs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupInput,
} from "@/components/ui/input-group";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
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
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { queryClient, queryUtils } from "@/utils/orpc";

type Team = {
	id: string;
	name: string;
	createdAt: Date;
	teamMembers: TeamMemberType[];
};

export const TeamList = () => {
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});

	// Search state
	const [searchTerm, setSearchTerm] = React.useState("");
	const debouncedSearch = useDebounce(searchTerm, 500);

	// Pagination state
	const [pagination, setPagination] = React.useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10,
	});

	// Date filter state
	const [dateRange, setDateRange] = React.useState<DateRange | undefined>();

	// Fetch Data
	const {
		data: { teams, pageCount, total },
	} = useSuspenseQuery(
		queryUtils.admin.team.listTeams.queryOptions({
			input: {
				page: pagination.pageIndex + 1,
				limit: pagination.pageSize,
				search: debouncedSearch || undefined,
				filters: dateRange
					? {
							dateRange: {
								from: dateRange.from?.toISOString(),
								to: dateRange.to?.toISOString(),
							},
						}
					: undefined,
				sorting: sorting.map((s) => ({
					id: s.id,
					desc: s.desc,
				})),
			},
		})
	);

	const { mutateAsync: deleteTeam } = useMutation({
		mutationKey: ["delete-team"],
		mutationFn: async ({ teamId }: { teamId: string }) => {
			await authClient.organization.removeTeam({
				teamId,
			});
		},
		onSuccess: () => {
			queryClient.refetchQueries({
				queryKey: queryUtils.admin.team.listTeams.queryKey({
					input: {
						page: pagination.pageIndex + 1,
						limit: pagination.pageSize,
						search: debouncedSearch || undefined,
						filters: dateRange
							? {
									dateRange: {
										from: dateRange.from?.toISOString(),
										to: dateRange.to?.toISOString(),
									},
								}
							: undefined,
						sorting: sorting.map((s) => ({
							id: s.id,
							desc: s.desc,
						})),
					},
				}),
			});
		},
	});

	const columns = React.useMemo<ColumnDef<Team>[]>(
		() => [
			{
				accessorKey: "name",
				header: ({ column }) => (
					<Button
						className="-ml-4 h-8 data-[state=open]:bg-accent"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						variant="ghost"
					>
						<span>Team Name</span>
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				),
				cell: ({ row }) => (
					<div className="font-medium">{row.getValue("name")}</div>
				),
			},
			{
				accessorKey: "teamMembers",
				header: ({ column }) => (
					<Button
						className="-ml-4 h-8 data-[state=open]:bg-accent"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						variant="ghost"
					>
						<Users className="mr-2 h-4 w-4" />
						Members
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				),
				cell: ({ row }) => {
					const members = row.getValue("teamMembers") as unknown[];
					return (
						<div className="flex items-center gap-2">
							<Badge className="rounded-sm font-normal" variant="secondary">
								{members.length} {members.length === 1 ? "Member" : "Members"}
							</Badge>
						</div>
					);
				},
				enableSorting: false,
			},
			{
				accessorKey: "createdAt",
				header: ({ column }) => (
					<Button
						className="-ml-4 h-8 data-[state=open]:bg-accent"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
						variant="ghost"
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						Created At
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				),
				cell: ({ row }) => (
					<div className="mr-10 text-muted-foreground">
						{new Date(row.getValue("createdAt")).toLocaleDateString(undefined, {
							year: "numeric",
							month: "short",
							day: "numeric",
							hour: "2-digit",
							minute: "2-digit",
						})}
					</div>
				),
			},
			{
				id: "actions",
				enableHiding: false,
				cell: ({ row }) => {
					const team = row.original;
					return (
						<div className="flex justify-end">
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
										render={
											<Suspense fallback={<Skeleton className="h-9 w-full" />}>
												<AddTeamMemberDialog teamId={team.id} />
											</Suspense>
										}
									/>
									<DropdownMenuItem
										render={
											<Suspense fallback={<Skeleton className="h-9 w-full" />}>
												<RemoveTeamMemberDialog teamId={team.id} />
											</Suspense>
										}
									/>
									<DropdownMenuSeparator />
									<DropdownMenuItem
										className="text-destructive focus:text-destructive"
										onClick={() => deleteTeam({ teamId: team.id })}
									>
										<Trash2 className="mr-2 h-4 w-4" />
										<span>Delete Team</span>
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					);
				},
			},
		],
		[deleteTeam]
	);

	const table = useReactTable({
		data: teams,
		columns,
		state: {
			sorting,
			columnVisibility,
			pagination,
		},
		pageCount,
		rowCount: total,
		onSortingChange: setSorting,
		onPaginationChange: setPagination,
		onColumnVisibilityChange: setColumnVisibility,
		getCoreRowModel: getCoreRowModel(),
		manualPagination: true,
		manualSorting: true,
		manualFiltering: true,
	});

	if (teams.length === 0 && !debouncedSearch && !dateRange) {
		return (
			<div className="rounded-lg border bg-card py-12 text-center text-card-foreground shadow-sm">
				<Building2 className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
				<h3 className="mb-2 font-medium text-lg">No teams found</h3>
				<p className="mb-4 text-muted-foreground">
					Get started by creating your first team.
				</p>
				<CreateTeamForm />
			</div>
		);
	}

	return (
		<div className="w-full rounded-md border bg-card text-card-foreground shadow-sm">
			<div className="flex items-center justify-between gap-4 border-b p-4">
				<div className="flex flex-1 items-center gap-2">
					<InputGroup className="w-full max-w-sm">
						<InputGroupAddon>
							<Search className="size-4" />
						</InputGroupAddon>
						<InputGroupInput
							onChange={(event) => setSearchTerm(event.target.value)}
							placeholder="Search teams..."
							value={searchTerm}
						/>
					</InputGroup>

					<Popover>
						<PopoverTrigger
							render={
								<Button
									className={cn(
										"w-60 justify-start text-left font-normal",
										!dateRange && "text-muted-foreground"
									)}
									variant={"outline"}
								>
									<CalendarIcon className="mr-2 h-4 w-4" />
									{dateRange?.from ? (
										dateRange.to ? (
											<>
												{format(dateRange.from, "LLL dd, y")} -{" "}
												{format(dateRange.to, "LLL dd, y")}
											</>
										) : (
											format(dateRange.from, "LLL dd, y")
										)
									) : (
										<span>Filter by date</span>
									)}
								</Button>
							}
						/>
						<PopoverContent align="start" className="w-auto p-0">
							<Calendar
								defaultMonth={dateRange?.from}
								mode="range"
								numberOfMonths={2}
								onSelect={(range) => {
									setDateRange(range);
									// Reset to first page on filter change
									setPagination((prev) => ({ ...prev, pageIndex: 0 }));
								}}
								selected={dateRange}
							/>
						</PopoverContent>
					</Popover>

					{/* Reset filter button if filters are active */}
					{(dateRange || searchTerm) && (
						<Button
							className="h-9 px-2 lg:px-3"
							onClick={() => {
								setDateRange(undefined);
								setSearchTerm("");
								setPagination((prev) => ({ ...prev, pageIndex: 0 }));
							}}
							variant="ghost"
						>
							Reset
						</Button>
					)}
				</div>
			</div>

			<div>
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
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

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
					<Button
						className="h-8 px-2 lg:px-3"
						disabled={!table.getCanPreviousPage()}
						onClick={() => table.setPageIndex(0)}
						variant="outline"
					>
						<span className="sr-only">Go to first page</span>
						<span className="hidden sm:block">First</span>
						<span className="sm:hidden">«</span>
					</Button>
					<Button
						className="h-8 px-2 lg:px-3"
						disabled={!table.getCanPreviousPage()}
						onClick={() => table.previousPage()}
						variant="outline"
					>
						<span className="sr-only">Go to previous page</span>
						<span className="hidden sm:block">Previous</span>
						<span className="sm:hidden">‹</span>
					</Button>
					<div className="flex items-center justify-center font-medium text-sm">
						Page {table.getState().pagination.pageIndex + 1} of{" "}
						{table.getPageCount() || 1}
					</div>
					<Button
						className="h-8 px-2 lg:px-3"
						disabled={!table.getCanNextPage()}
						onClick={() => table.nextPage()}
						variant="outline"
					>
						<span className="sr-only">Go to next page</span>
						<span className="hidden sm:block">Next</span>
						<span className="sm:hidden">›</span>
					</Button>
					<Button
						className="h-8 px-2 lg:px-3"
						disabled={!table.getCanNextPage()}
						onClick={() => table.setPageIndex(table.getPageCount() - 1)}
						variant="outline"
					>
						<span className="sr-only">Go to last page</span>
						<span className="hidden sm:block">Last</span>
						<span className="sm:hidden">»</span>
					</Button>
				</div>
			</div>
		</div>
	);
};

export const TeamListSkeleton = () => (
	<div className="w-full rounded-md border bg-card shadow-sm">
		<div className="flex items-center justify-between border-b p-4">
			<Skeleton className="h-9 w-75" />
			<Skeleton className="h-9 w-36" />
		</div>
		<div className="relative w-full">
			<Table>
				<TableHeader>
					<TableRow>
						{Array.from({ length: 5 }).map((_, i) => (
							<TableHead key={i.toString()}>
								<Skeleton className="h-4 w-24" />
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{Array.from({ length: 5 }).map((_, i) => (
						<TableRow key={i.toString()}>
							{Array.from({ length: 5 }).map((_, j) => (
								<TableCell key={j.toString()}>
									<Skeleton className="h-6 w-full" />
								</TableCell>
							))}
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
		<div className="flex items-center justify-between border-t p-4">
			<Skeleton className="h-8 w-50" />
			<Skeleton className="h-8 w-75" />
		</div>
	</div>
);
