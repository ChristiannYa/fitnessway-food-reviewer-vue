export const mutationKeys = {
	food: {
		pending: {
			all: () => ["food", "pending"] as const,
            
			review: () => ["food", "pending", "review"] as const
		}
	}
};