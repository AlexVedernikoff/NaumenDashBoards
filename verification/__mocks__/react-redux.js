module.exports = {
	connect: (mapStateToProps, mapDispatchToProps) => ReactComponent => ({
		mapDispatchToProps,
		mapStateToProps,
		ReactComponent,
	}),
	Provider: ({children}) => children
};
