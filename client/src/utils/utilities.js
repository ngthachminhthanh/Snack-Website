const getStatusName = (status) => {
	switch (status) {
		case 'waiting for confirmation':
		    return 'Đang chờ xác nhận';
		case 'shipping':
			return 'Đang vận chuyển';
		case 'delivered':
			return 'Đã giao';
		case 'cancelled':
			return 'Đã hủy';
		default:
			return status;
	}
};

export { getStatusName };