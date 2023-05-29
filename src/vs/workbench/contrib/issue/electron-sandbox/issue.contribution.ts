/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from 'vs/nls';
import { MenuRegistry, MenuId, registerAction2, Action2 } from 'vs/platform/actions/common/actions';
import { InstantiationType, registerSingleton } from 'vs/platform/instantiation/common/extensions';
import { IWorkbenchIssueService } from 'vs/workbench/services/issue/common/issue';
import { NativeIssueService } from 'vs/workbench/services/issue/electron-sandbox/issueService';
import { CommandsRegistry } from 'vs/platform/commands/common/commands';
import { IIssueService } from 'vs/platform/issue/electron-sandbox/issue';
import { BaseIssueContribution } from 'vs/workbench/contrib/issue/common/issue.contribution';
import { IProductService } from 'vs/platform/product/common/productService';
import { Registry } from 'vs/platform/registry/common/platform';
import { Extensions, IWorkbenchContributionsRegistry } from 'vs/workbench/common/contributions';
import { LifecyclePhase } from 'vs/workbench/services/lifecycle/common/lifecycle';
import { Categories } from 'vs/platform/action/common/actionCommonCategories';
import { ServicesAccessor } from 'vs/platform/instantiation/common/instantiation';
import { INativeEnvironmentService } from 'vs/platform/environment/common/environment';
import { IDialogService } from 'vs/platform/dialogs/common/dialogs';
import { INativeHostService } from 'vs/platform/native/common/native';
import { IProgressService, ProgressLocation } from 'vs/platform/progress/common/progress';
import { IssueType } from 'vs/platform/issue/common/issue';

//Build

MenuRegistry.appendMenuItem(MenuId.MenubarBuildMenu, {
	group: '1_build',
	command: {
		id: 'cmake.clean',
		title: localize({ key: 'miCleanUp', comment: ['&& denotes a mnemonic'] }, "Clean &&Up")
	},
	order: 1
});
MenuRegistry.appendMenuItem(MenuId.MenubarBuildMenu, {
	group: '1_build',
	command: {
		id: 'cmake.build',
		title: localize({ key: 'miBuild', comment: ['&& denotes a mnemonic'] }, "&&Build"),
	},
	order: 2
});
MenuRegistry.appendMenuItem(MenuId.MenubarBuildMenu, {
	group: '1_run',
	command: {
		id: 'hyseim.runAction',
		title: localize({ key: 'miRun', comment: ['&& denotes a mnemonic'] }, "&&Run")
	},
	order: 1
});
MenuRegistry.appendMenuItem(MenuId.MenubarBuildMenu, {
	group: '2_run',
	command: {
		id: 'hyseim.buildAndRun',
		title: localize({ key: 'miBuildAndRun', comment: ['&& denotes a mnemonic'] }, "Build and &&Run")
	},
	order: 1
});
MenuRegistry.appendMenuItem(MenuId.MenubarBuildMenu, {
	group: '2_run',
	command: {
		id: 'hyseim.buildAndDebug',
		title: localize({ key: 'miBuildAndDebug', comment: ['&& denotes a mnemonic'] }, "Build and &&Debug")
	},
	order: 2
});
MenuRegistry.appendMenuItem(MenuId.MenubarBuildMenu, {
	group: '2_run',
	command: {
		id: 'hyseim.buildAndFlash',
		title: localize({ key: 'miBuildAndFlash', comment: ['&& denotes a mnemonic'] }, "Build and &&Flash")
	},
	order: 3
});


//Project

// MenuRegistry.appendMenuItem(MenuId.MenubarProjectMenu, {
// 	group: '1_Hello',
// 	command: {
// 		id: 'extension.helloWorld',
// 		title: localize({ key: 'miHello', comment: ['&& denotes a mnemonic'] }, "&&Hello")
// 	},
// 	order: 2
// });

MenuRegistry.appendMenuItem(MenuId.MenubarProjectMenu, {
	group: '1_flash',
	command: {
		id: 'hyseim.projectSetting',
		title: localize({ key: 'miProjectSetting', comment: ['&& denotes a mnemonic'] }, "Project &&Setting")
	},
	order: 1
});

MenuRegistry.appendMenuItem(MenuId.MenubarProjectMenu, {
	group: '1_flash',
	command: {
		id: 'hyseim.flashManagerEditor.show',
		title: localize({ key: 'miFlashEditor', comment: ['&& denotes a mnemonic'] }, "Flash &&Editor")
	},
	order: 2
});

MenuRegistry.appendMenuItem(MenuId.MenubarProjectMenu, {
	group: '1_openocd',
	title: localize({ key: 'miOpenOCD', comment: ['&& denotes a mnemonic'] }, "&&OpenOCD"),
	submenu: MenuId.MenubarOpenOCDMenu,
	order: 3
});

MenuRegistry.appendMenuItem(MenuId.MenubarOpenOCDMenu, {
	group: '1_openocd',
	command: {
		id: 'workbench.action.openocd.start',
		title: localize({ key: 'miStartOpenocdServer', comment: ['&& denotes a mnemonic'] }, "Start &&Openocd Server")
	},
	order: 1
});

MenuRegistry.appendMenuItem(MenuId.MenubarOpenOCDMenu, {
	group: '2_openocd',
	command: {
		id: 'workbench.action.openocd.restart',
		title: localize({ key: 'miRestartOpenocdServer', comment: ['&& denotes a mnemonic'] }, "Restart &&Openocd Server")
	},
	order: 1
});

MenuRegistry.appendMenuItem(MenuId.MenubarOpenOCDMenu, {
	group: '3_openocd',
	command: {
		id: 'workbench.action.openocd.stop',
		title: localize({ key: 'miStopOpenocdServer', comment: ['&& denotes a mnemonic'] }, "Stop &&Openocd Server")
	},
	order: 1
});

MenuRegistry.appendMenuItem(MenuId.MenubarProjectMenu, {
	group: '1_hardware',
	title: localize({ key: 'mihardware configuration', comment: ['&& denotes a mnemonic'] }, "Hardware &&Configuration"),
	submenu: MenuId.MenubarHardwareMenu,
	order: 3
});

MenuRegistry.appendMenuItem(MenuId.MenubarHardwareMenu, {
	group: '1_pin',
	command: {
		id: 'hyseim.pinoutEditor.show',
		title: localize({ key: 'mipin configuration', comment: ['&& denotes a mnemonic'] }, "Pin &&Configuration")
	},
	order: 1
});

MenuRegistry.appendMenuItem(MenuId.MenubarHardwareMenu, {
	group: '2_motor',
	command: {
		id: 'hyseim.motorProfile.show',
		title: localize({ key: 'mimotor configuration', comment: ['&& denotes a mnemonic'] }, "Motor &&Configuration")
	},
	order: 1
});
//#region Issue Contribution

registerSingleton(IWorkbenchIssueService, NativeIssueService, InstantiationType.Delayed);

class NativeIssueContribution extends BaseIssueContribution {

	constructor(
		@IProductService productService: IProductService
	) {
		super(productService);

		if (productService.reportIssueUrl) {
			registerAction2(ReportPerformanceIssueUsingReporterAction);
		}
	}
}
Registry.as<IWorkbenchContributionsRegistry>(Extensions.Workbench).registerWorkbenchContribution(NativeIssueContribution, LifecyclePhase.Restored);

class ReportPerformanceIssueUsingReporterAction extends Action2 {

	static readonly ID = 'workbench.action.reportPerformanceIssueUsingReporter';

	constructor() {
		super({
			id: ReportPerformanceIssueUsingReporterAction.ID,
			title: { value: localize({ key: 'reportPerformanceIssue', comment: [`Here, 'issue' means problem or bug`] }, "Report Performance Issue..."), original: 'Report Performance Issue' },
			category: Categories.Help,
			f1: true
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const issueService = accessor.get(IWorkbenchIssueService);

		return issueService.openReporter({ issueType: IssueType.PerformanceIssue });
	}
}

//#endregion

//#region Commands

class OpenProcessExplorer extends Action2 {

	static readonly ID = 'workbench.action.openProcessExplorer';

	constructor() {
		super({
			id: OpenProcessExplorer.ID,
			title: { value: localize('openProcessExplorer', "Open Process Explorer"), original: 'Open Process Explorer' },
			category: Categories.Developer,
			f1: true
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const issueService = accessor.get(IWorkbenchIssueService);

		return issueService.openProcessExplorer();
	}
}
registerAction2(OpenProcessExplorer);
MenuRegistry.appendMenuItem(MenuId.MenubarHelpMenu, {
	group: '5_tools',
	command: {
		id: OpenProcessExplorer.ID,
		title: localize({ key: 'miOpenProcessExplorerer', comment: ['&& denotes a mnemonic'] }, "Open &&Process Explorer")
	},
	order: 2
});

class StopTracing extends Action2 {

	static readonly ID = 'workbench.action.stopTracing';

	constructor() {
		super({
			id: StopTracing.ID,
			title: { value: localize('stopTracing', "Stop Tracing"), original: 'Stop Tracing' },
			category: Categories.Developer,
			f1: true
		});
	}

	override async run(accessor: ServicesAccessor): Promise<void> {
		const issueService = accessor.get(IIssueService);
		const environmentService = accessor.get(INativeEnvironmentService);
		const dialogService = accessor.get(IDialogService);
		const nativeHostService = accessor.get(INativeHostService);
		const progressService = accessor.get(IProgressService);

		if (!environmentService.args.trace) {
			const { confirmed } = await dialogService.confirm({
				message: localize('stopTracing.message', "Tracing requires to launch with a '--trace' argument"),
				primaryButton: localize({ key: 'stopTracing.button', comment: ['&& denotes a mnemonic'] }, "&&Relaunch and Enable Tracing"),
			});

			if (confirmed) {
				return nativeHostService.relaunch({ addArgs: ['--trace'] });
			}
		}

		await progressService.withProgress({
			location: ProgressLocation.Dialog,
			title: localize('stopTracing.title', "Creating trace file..."),
			cancellable: false,
			detail: localize('stopTracing.detail', "This can take up to one minute to complete.")
		}, () => issueService.stopTracing());
	}
}
registerAction2(StopTracing);

CommandsRegistry.registerCommand('_issues.getSystemStatus', (accessor) => {
	return accessor.get(IIssueService).getSystemStatus();
});

//#endregion
