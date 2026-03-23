/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AddToBlacklistDto } from './dto/add-to-blacklist.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { CurrentUser } from 'src/common/decorators/current-user/current-user.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get('profile/:id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('profile/:id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete('profile/:id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Get('friends')
  getAllFriends(@CurrentUser() currentUser: any) {
    return this.usersService.getAllFriends(currentUser.id);
  }

  @Post('friends/requests/:userId')
  sendFriendRequest(
    @Param('userId') targetUserId: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.usersService.sendFriendRequest(currentUser.id, targetUserId);
  }

  @Patch('friends/requests/:requestId/accept')
  acceptFriendRequest(
    @Param('requestId') requestId: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.usersService.acceptFriendRequest(currentUser.id, requestId);
  }

  @Delete('friends/requests/:requestId/reject')
  rejectFriendRequest(
    @Param('requestId') requestId: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.usersService.rejectFriendRequest(currentUser.id, requestId);
  }

  @Delete('friends/:friendId')
  removeFriend(
    @Param('friendId') friendId: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.usersService.removeFriend(currentUser.id, friendId);
  }

  @Patch('settings/password')
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.usersService.changePassword(currentUser.id, changePasswordDto);
  }

  @Get('settings')
  getSettings(@CurrentUser() currentUser: any) {
    return this.usersService.getSettings(currentUser.id);
  }

  @Patch('settings')
  updateSettings(
    @Body() updateSettingsDto: UpdateSettingsDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.usersService.updateSettings(currentUser.id, updateSettingsDto);
  }

  @Get('blacklist')
  getAllBlackList(@CurrentUser() currentUser: any) {
    return this.usersService.getAllBlackList(currentUser.id);
  }

  @Post('blacklist/:userId')
  addToBlackList(
    @Param('userId') userId: string,
    @Body() addToBlacklistDto: AddToBlacklistDto,
    @CurrentUser() currentUser: any,
  ) {
    return this.usersService.addToBlackList(
      currentUser.id,
      userId,
      addToBlacklistDto,
    );
  }

  @Delete('blacklist/:userId')
  removeFromBlackList(
    @Param('userId') userId: string,
    @CurrentUser() currentUser: any,
  ) {
    return this.usersService.removeFromBlackList(currentUser.id, userId);
  }

  @Get('search')
  searchUsersByQuery(
    @CurrentUser() currentUser: any,
    @Query('query') query: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.usersService.searchUsersByQuery(
      currentUser.id,
      query,
      limit ? parseInt(limit) : 20,
      offset ? parseInt(offset) : 0,
    );
  }
}
