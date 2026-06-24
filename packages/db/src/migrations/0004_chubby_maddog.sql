DROP INDEX "idx_call_participant_call_user";--> statement-breakpoint
CREATE UNIQUE INDEX "unique_call_participant_call_user" ON "callParticipant" USING btree ("callId","userId");