import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth/jwt-auth.guard';
import * as currentUserDecorator from '../common/decorators/current-user/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import {
  CreateUserDto,
  UpdateUserDto,
  ChangePasswordDto,
  AddToBlacklistDto,
  UpdateSettingsDto,
  SearchUsersQueryDto,
  CreateFriendRequestDto,
} from './dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }

  @Public()
  @Get()
  async findAll() {
    return await this.usersService.findAll();
  }

  @Public()
  @Get('profile/:id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return await this.usersService.findOne(id);
  }

  @Patch('profile')
  async update(
    @currentUserDecorator.CurrentUser()
    currentUser: currentUserDecorator.CurrentUserPayload,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update(currentUser.id, updateUserDto);
  }

  @Delete('profile')
  async remove(@currentUserDecorator.CurrentUser('id') userId: string) {
    return await this.usersService.remove(userId);
  }

  @Get('friends')
  async getAllFriends(@currentUserDecorator.CurrentUser('id') userId: string) {
    return await this.usersService.getAllFriends(userId);
  }

  @Post('friends/requests')
  async sendFriendRequest(
    @Body() createRequestDto: CreateFriendRequestDto,
    @currentUserDecorator.CurrentUser('id') currentUserId: string,
  ) {
    return await this.usersService.sendFriendRequest(
      currentUserId,
      createRequestDto.targetUserId,
    );
  }

  @Patch('friends/requests/:requestId/accept')
  async acceptFriendRequest(
    @Param('requestId', ParseUUIDPipe) requestId: string,
    @currentUserDecorator.CurrentUser('id') currentUserId: string,
  ) {
    return await this.usersService.acceptFriendRequest(
      currentUserId,
      requestId,
    );
  }

  @Delete('friends/requests/:requestId/reject')
  async rejectFriendRequest(
    @Param('requestId', ParseUUIDPipe) requestId: string,
    @currentUserDecorator.CurrentUser('id') currentUserId: string,
  ) {
    return await this.usersService.rejectFriendRequest(
      currentUserId,
      requestId,
    );
  }

  @Delete('friends/:friendId')
  async removeFriend(
    @Param('friendId', ParseUUIDPipe) friendId: string,
    @currentUserDecorator.CurrentUser('id') currentUserId: string,
  ) {
    return await this.usersService.removeFriend(currentUserId, friendId);
  }

  @Get('friends/requests/incoming')
  async getIncomingRequests(
    @currentUserDecorator.CurrentUser('id') userId: string,
  ) {
    return await this.usersService.getIncomingFriendRequests(userId);
  }

  @Get('friends/requests/outgoing')
  async getOutgoingRequests(
    @currentUserDecorator.CurrentUser('id') userId: string,
  ) {
    return await this.usersService.getOutgoingFriendRequests(userId);
  }

  @Get('settings')
  async getSettings(@currentUserDecorator.CurrentUser('id') userId: string) {
    return await this.usersService.getSettings(userId);
  }

  @Patch('settings')
  async updateSettings(
    @Body() updateSettingsDto: UpdateSettingsDto,
    @currentUserDecorator.CurrentUser('id') userId: string,
  ) {
    return await this.usersService.updateSettings(userId, updateSettingsDto);
  }

  @Patch('settings/password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @currentUserDecorator.CurrentUser('id') userId: string,
  ) {
    return await this.usersService.changePassword(userId, changePasswordDto);
  }

  @Get('blacklist')
  async getAllBlackList(
    @currentUserDecorator.CurrentUser('id') userId: string,
  ) {
    return await this.usersService.getAllBlackList(userId);
  }

  @Post('blacklist')
  async addToBlackList(
    @Body() addToBlacklistDto: AddToBlacklistDto,
    @currentUserDecorator.CurrentUser('id') currentUserId: string,
  ) {
    return await this.usersService.addToBlackList(
      currentUserId,
      addToBlacklistDto.userId,
      addToBlacklistDto,
    );
  }

  @Delete('blacklist/:userId')
  async removeFromBlackList(
    @Param('userId', ParseUUIDPipe) userId: string,
    @currentUserDecorator.CurrentUser('id') currentUserId: string,
  ) {
    return await this.usersService.removeFromBlackList(currentUserId, userId);
  }

  @Get('search')
  async searchUsersByQuery(
    @currentUserDecorator.CurrentUser('id') currentUserId: string,
    @Query() searchQuery: SearchUsersQueryDto,
  ) {
    return await this.usersService.searchUsersByQuery(
      currentUserId,
      searchQuery.query || '',
      searchQuery.limit,
      searchQuery.offset,
    );
  }
}
