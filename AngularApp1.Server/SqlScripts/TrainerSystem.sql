USE [master]
GO
CREATE DATABASE TrainerSystem;
GO
USE [TrainerSystem]
GO
/****** Object:  Table [dbo].[Exercise]    Script Date: 05.02.2024 08:14:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Exercise](
	[idExercise] [numeric](28, 0) NOT NULL,
	[name] [varchar](255) NOT NULL,
 CONSTRAINT [Exercise_PK] PRIMARY KEY CLUSTERED 
(
	[idExercise] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Item]    Script Date: 05.02.2024 08:14:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Item](
	[idItem] [numeric](28, 0) NOT NULL,
	[name] [varchar](255) NOT NULL,
	[price] [numeric](28, 0) NOT NULL,
	[Days] [int] NOT NULL,
 CONSTRAINT [Item_PK] PRIMARY KEY CLUSTERED 
(
	[idItem] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Training]    Script Date: 05.02.2024 08:14:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Training](
	[idTraining] [numeric](28, 0) NOT NULL,
	[dayOfWeek] [tinyint] NOT NULL,
	[idExercise] [numeric](28, 0) NOT NULL,
	[idTransaction] [numeric](28, 0) NOT NULL,
 CONSTRAINT [Training_PK] PRIMARY KEY CLUSTERED 
(
	[idTraining] ASC,
	[idExercise] ASC,
	[idTransaction] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Transaction]    Script Date: 05.02.2024 08:14:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Transaction](
	[idTransaction] [numeric](28, 0) NOT NULL,
	[isPaid] [bit] NOT NULL,
	[idItem] [numeric](28, 0) NULL,
	[emailUser] [varchar](255) NULL,
	[DateOfTransaction] [datetimeoffset](7) NULL,
 CONSTRAINT [Transaction_PK] PRIMARY KEY CLUSTERED 
(
	[idTransaction] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[User]    Script Date: 05.02.2024 08:14:55 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[User](
	[email] [varchar](255) NOT NULL,
	[name] [varchar](255) NOT NULL,
	[surname] [varchar](255) NOT NULL,
 CONSTRAINT [User_PK] PRIMARY KEY CLUSTERED 
(
	[email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Training]  WITH CHECK ADD  CONSTRAINT [Exercise_FK] FOREIGN KEY([idExercise])
REFERENCES [dbo].[Exercise] ([idExercise])
GO
ALTER TABLE [dbo].[Training] CHECK CONSTRAINT [Exercise_FK]
GO
ALTER TABLE [dbo].[Training]  WITH CHECK ADD  CONSTRAINT [Transaction_FK] FOREIGN KEY([idTransaction])
REFERENCES [dbo].[Transaction] ([idTransaction])
GO
ALTER TABLE [dbo].[Training] CHECK CONSTRAINT [Transaction_FK]
GO
ALTER TABLE [dbo].[Transaction]  WITH CHECK ADD  CONSTRAINT [Item_FK] FOREIGN KEY([idItem])
REFERENCES [dbo].[Item] ([idItem])
GO
ALTER TABLE [dbo].[Transaction] CHECK CONSTRAINT [Item_FK]
GO
ALTER TABLE [dbo].[Transaction]  WITH CHECK ADD  CONSTRAINT [User_FK] FOREIGN KEY([emailUser])
REFERENCES [dbo].[User] ([email])
GO
ALTER TABLE [dbo].[Transaction] CHECK CONSTRAINT [User_FK]
GO
