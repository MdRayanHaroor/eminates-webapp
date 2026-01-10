-- Enable RLS on notifications table if not already enabled
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy to allow Admins to INSERT notifications for ANY user
CREATE POLICY "Admins can insert notifications"
ON notifications
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM users
    WHERE users.id = auth.uid()
    AND users.role = 'admin'
  )
);

-- Policy to allow users to VIEW their own notifications
-- (Assuming this might already exist, but ensuring it's there)
CREATE POLICY "Users can view their own notifications"
ON notifications
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
);
